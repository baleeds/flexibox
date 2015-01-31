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

require('./server/postRoutes.js')(router, isLoggedIn);

require('./server/commentRoutes.js')(router, isLoggedIn);

require('./server/userRoutes.js')(router, isLoggedIn);


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