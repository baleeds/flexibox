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


require('./server/projectRoutes.js')(router, isLoggedIn);

require('./server/setRoutes.js')(router, isLoggedIn);




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