// Base setup for our server.  Includes creating the API routes.
// =============================================================

// call the packages we need
var express        = require('express');  // call express
var app            = express();           // define our app using express
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var multer         = require('multer');
var fs             = require('fs');
var session		   = require('express-session');
var cookieParser   = require('cookie-parser');

var passport = require('passport');
var flash    = require('connect-flash');

// call the schemas we created
var Project = require('./app/common/models/projects');
var User = require('./app/common/models/users');

// get server config
var config = require('./config');
console.log("Server config = ", config);


require('./passport/passport')(passport); // pass passport for configuration

//connect to local server
mongoose.connect('mongodb://' + config.server.host + '/flexibox');
var port = process.env.PORT || config.server.port;  // set port

// configure the client
app.use('/', express.static(__dirname));
app.use(bodyParser());
app.use(multer({ dest: config.uploadsDir }));



	// set up our express application
	app.use(cookieParser()); // read cookies (needed for auth)

	// required for passport
	app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session



// Routes for our app
// ==================================================

var router = express.Router();             // get an instance of the router
// middleware to use for all requests
router.use(function(req, res, next) {
	next();
});


// process the login form
router.route('/login')

	.post(passport.authenticate('local-login', {

		successRedirect : '/projects', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

// process the signup form
router.route('/signup')
	.post(passport.authenticate('local-signup', {
		successRedirect : '/projects', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

router.route('/logout')
	.get(function(req, res) {
		req.logout();
		console.log("Logged out");
		res.redirect('/');
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	console.log("Are you logged in: " + req.isAuthenticated());

	if (req.isAuthenticated()) {
		console.log("Current User: " + req.user.id);
		return next();
	}
	else {
		// if they aren't redirect them to the home
		return res.status('401').end();
		//next();
	}
};




router.route('/all') // accessed at //<server>:<port>/api/all
    .all(isLoggedIn)
	// used to return all data
	.get(function(req, res) {
		Project.find().exec(function(err,projects) {
			if (err)
				res.send(err);
			res.json(projects);
		});
	});






// PROJECT ROUTES
// ==========================================================================
router.route('/projects')  // accessed at //<server>:<port>/api/projects
    .all(isLoggedIn)
	// add a project
	.post(function(req, res) {
		console.log(req.body);
		var project = new Project();

		project.name = req.body.name;
		project.description = req.body.description;
		project.entryURL = '/api/projects/' + project._id;
		project.setsURL = project.entryURL + '/sets';

		project.save(function(err) {
			if (err)
				res.send(err);

			Project.find(function(err, projects) {
				if (err) res.send(err);
				res.json(projects);
			});
		});
	})

	// get all projects
	.get(function(req, res) {
		Project
		.find()
		.select('name description setsURL entryURL')
		.exec(function(err, projects) {
			if (err)
				res.send(err);

			res.json(projects);
		});
	});

router.route('/projects/:project_id') // accessed at //<server>:<port>/api/projects/id
    .all(isLoggedIn)
	// get a project
	.get(function(req, res) {
		if (req.query.includeSets) {
			Project
			.findById(req.params.project_id)
			.select('name description setsURL entryURL sets._id sets.name sets.description')
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project);
			});
		} else {
			Project
			.findById(req.params.project_id)
			.select('name description setsURL entryURL')
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project);
			});
		}
		
	})

	// update a project
	.put(function(req, res) {

		Project.findById(req.params.project_id, function(err, project) {
			if (err)
				res.send(err);

			project.name = req.body.name;
			project.description = req.body.description;

			// save the project
			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project);
			});
		});
	})

	// delete a project
	.delete(function(req, res) {
		Project.remove({
			_id: req.params.project_id
		}, function(err, bear) {
			if (err)
				res.send(err);
			
			Project.find(function(err, projects) {
				if (err) res.send(err);
				res.json(projects);
			});
		});
	});







// SET ROUTES
// ==========================================================================
router.route('/projects/:project_id/sets') // accessed at //<server>:<port>/api/projects/<project_id>/sets
    .all(isLoggedIn)
	.get(function(req, res) {
		Project
		.findById(req.params.project_id)
		.select('sets._id sets.name sets.description sets.entryURL sets.postsURL')
		.exec(function(err, project) {
			if (err)
				res.send(err);
			res.json(project.sets);
		});
	})

	// create a set
	.post(function(req, res) {
		Project
		.findById(req.params.project_id)
		.select('name description sets._id sets.name sets.description sets.entryURL sets.postsURL')
		.exec(function(err, project) {
			if (err)
				res.send(err);
			var newSet = {};
			newSet.name = req.body.name;
			newSet.description = req.body.description;
			newSet.entryURL = '/api/projects' + req.params.project_id + '/sets/' + newSet._id;
			newSet.postsURL = '/api/projects' + req.params.project_id + '/sets/' + newSet._id + '/posts';

			project.sets.push(newSet);

			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project);
			});
		});
	});

router.route('/projects/:project_id/sets/:set_id') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>
    .all(isLoggedIn)
	// get a set
	.get(function(req, res) {
		if (req.query.includePosts) {
			Project
			.find({'sets._id':req.params.set_id},{sets:1})
			.select({sets: {$elemMatch: {_id: req.params.set_id}}, 'sets.posts.comments':0})
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project[0].sets[0]);
			});
		} else {
			Project
			.find({'sets._id':req.params.set_id},{sets:1})
			.select({sets: {$elemMatch: {_id: req.params.set_id}}, 'sets.posts':0})
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project[0].sets[0]);
			});
		}
	})

	// update a set
	.put(function(req, res) {
		Project.findById(req.params.project_id, function(err, project) {
			if (err)
				res.send(err);

			project.sets.id(req.params.set_id).name = req.body.name;
			project.sets.id(req.params.set_id).description = req.body.description;

			project.save(function(err) {
				if (err)
					res.send(err);
				res.json({"name":project.sets.id(req.params.set_id).name, "description":project.sets.id(req.params.set_id).description});
			});
		});
	})

	// delete a set
	.delete(function(req, res) {
		Project
		.findById(req.params.project_id)
		.select('name description sets._id sets.name sets.description')
		.exec(function(err, project) {
			if (err)
				res.send(err);
			project.sets.id(req.params.set_id).remove();
			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project);
			});
		});
	});







// POST ROUTES
// ==========================================================================
router.route('/projects/:project_id/sets/:set_id/posts') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts
    .all(isLoggedIn)
	.get(function(req, res) {
		if (req.query.includeComments) {
			Project
			.findById(req.params.project_id)
			.select('sets.posts.name sets.posts.description sets.posts.comments sets.posts._id')
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project.sets[0].posts);
			});
		} else {
			Project
			.findById(req.params.project_id)
			.select('sets.posts.name sets.posts.description sets.posts._id')
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project.sets[0].posts);
			});
		}
	})

	// create a post
	.post(function(req, res) {
		Project
		.findById(req.params.project_id)
		.select('name description sets._id sets.name sets.description sets.posts')
		.exec(function(err, project) {
			if (err)
				res.send(err);
			var newPost = {};
			newPost.name = req.body.name;
			newPost.description = req.body.description;
			newPost.imageURL = req.body.imageURL;

			project.sets.id(req.params.set_id).posts.push(newPost);

			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project.sets.id(req.params.set_id));
			});
		});
	});


router.route('/projects/:project_id/sets/:set_id/posts/:post_id') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts/<post_id>
    .all(isLoggedIn)
	// get a post
	.get(function(req,res) {
		if (req.query.includeComments) {
			Project
			.find({_id:req.params.project_id},{sets:{$elemMatch: {_id: req.params.set_id}},'sets.description':0})
			.select({posts: {$elemMatch: {_id: req.params.post_id}}})
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project[0].sets[0].posts.id(req.params.post_id));
			});
		} else {
			Project
			.find({_id:req.params.project_id},{sets:{$elemMatch: {_id: req.params.set_id}},'sets.description':0, 'sets.posts.comments':0})
			.select({posts: {$elemMatch: {_id: req.params.post_id}}})
			.exec(function(err, project) {
				if (err)
					res.send(err);
				res.json(project[0].sets[0].posts.id(req.params.post_id));
			});
		}
	})

	// update a post
	.put(function(req,res) {
		Project.findById(req.params.project_id, function(err, project){
			if (err)
				res.send(err);

			project.sets.id(req.params.set_id).posts.id(req.params.post_id).name = req.body.name;
			project.sets.id(req.params.set_id).posts.id(req.params.post_id).description = req.body.description;

			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id));
			});
		});
	})

	// delete a post
	.delete(function(req,res) {
		Project.findById(req.params.project_id, function(err, project) {
			if (err)
				res.send(err);
			project.sets.id(req.params.set_id).posts.id(req.params.post_id).remove();
			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project.sets.id(req.params.set_id));
			});
		});
	});







// COMMENT ROUTES
// ==========================================================================
router.route('/projects/:project_id/sets/:set_id/posts/:post_id/comments') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts/<post_id>/comments
    .all(isLoggedIn)
    .get(function(req, res) {
		Project
		.findById(req.params.project_id)
		.select('sets._id sets.posts._id sets.posts.comments.posterName sets.posts.comments.txt sets.posts.comments')
		.exec(function(err, project) {
			if (err)
				res.send(err);
			res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments);
		});
	})

	// create a comment
	.post(function(req, res) {
		Project.findById(req.params.project_id, function(err, project){
			if (err)
				res.send(err);

			newComment = {};
			newComment.posterName = req.body.posterName;
			newComment.txt = req.body.txt;
			newComment.smallest   = req.body.smallest;
			newComment.width      = req.body.width;
			newComment.height     = req.body.height;
			newComment.color      = req.body.color;
			newComment.number     = req.body.number;


			project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.push(newComment);

			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id));
			});
		});
	});

router.route('/projects/:project_id/sets/:set_id/posts/:post_id/comments/:comment_id') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts/<post_id>/comments/<comment_id>
    .all(isLoggedIn)
    .get(function(req, res) {
		Project
		.findById(req.params.project_id)
		.exec(function(err, project) {
			if (err)
				res.send(err);
			res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id));
		});
	})

	.put(function(req,res) {
		Project
		.findById(req.params.project_id)
		.exec(function(err, project) {
			if (err)
				res.send(err);
			project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).posterName = req.body.posterName;
			project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).txt = req.body.txt;

			project.save(function(err) {
				if(err)
					res.send(err);
				res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id));
			});
		});
	})

	// delete a comment
	.delete(function(req,res) {
		Project.findById(req.params.project_id, function(err, project) {
			if (err)
				res.send(err);
			project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).remove();
			project.save(function(err) {
				if (err)
					res.send(err);
				res.json(project.sets.id(req.params.set_id));
			});
		});
	});






// USER ROUTES
// =====================================================================================
router.route('/users')  // accessed at POST //<server>:<port>/api/users
    .all(isLoggedIn)
	.post(function(req, res) {
		var user = new User();

		user.name = req.body.name;
		user.displayName = req.body.name;


		user.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'User Created!' });
		});
	})

	.get(function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
	});

router.route('/users/current')
    .all(isLoggedIn)
    .get(function(req, res) {
		console.log(req.user);
		User.findById(req.user.id, function(err, user) {
			if (err)
				res.send(err);
			res.json(user);
		});
	})

	.put(function(req, res) {

		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);

			// update fields here!
			user.name = req.body.name;
			user.displayName = req.body.displayName;
			user.imageURL = req.body.imageURL;
			user.emailSettings = req.body.emailSettings;
			user.projectsVisible = req.body.projectsVisible;

			// save the user
			user.save(function(err) {
				if (err)
					res.send(err);
				res.json({message:'User Updated'});
			});
		});
	})

	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, bear) {
			if (err)
				res.send(err);
			res.json({message:'Successfully deleted'});
		});
	});

router.route('/upload')
    .all(isLoggedIn)
    .post(function(req, res) {
		
		res.json({imageURL:req.files.image.path});
	});

router.route('/upload/:url')
    .all(isLoggedIn)
    .delete(function(req, res) {
		fs.unlink('./uploads/' + req.params.url, function(err) {
			if (err) throw err;
			res.json({message:'Successfully Deleted'});
		});
	});



// Register our routes
// ====================================================


// all of our routes are prefixed with /api
app.use('/api', router);

app.get('/', function(req, res) {
	res.sendfile('./index.html');

});
app.get('/test/', function(req, res) {
	res.sendfile('./test/specRunner.html');
	console.log(req.user);
});

app.get('*', function(req, res) {
	res.sendfile('./index.html');
});

/**
 *  Attempted to use isLoggedIn.. does not work here...
 *  More work should be done in terms of discovering how to
 *  protect an route.
 *
 */

// Start the server
// ====================================================
app.listen(port);
console.log('Magic happens on port ' + port);