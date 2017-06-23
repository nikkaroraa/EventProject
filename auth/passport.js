const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../db/models').models;
const BearerStrategy = require('passport-http-bearer').Strategy;

/*
	Used when Sessions are used in COOKIE-BASED manner
	Passport will serialize and deserialize user instances to and from the session. 

*/

/*
	In this example, only the user email is serialized to the session, keeping the amount of data 
	stored within the session small. When subsequent requests are received, this email is used to 
	find the user, which will be restored to req.user.
*/

/*
	In computer science, in the context of data storage, serialization is the process of translating 
	data structures or object state into a format that can be stored (for example, in a file or memory 
	buffer) or transmitted (for example, across a network connection link) and reconstructed later 
	(possibly in a different computer environment).
*/

//Serializing stores the user.email in the cookie-set
//Serializing - Converting it into a different format

//what to do after getting the req.session object populated

//stores the user.email in the session/cookie as a session ID 
//we don't have to tell the cookie separately to write user.email into it. Does that with only one line.
//storing the user in the form of user.email in the cookie

passport.serializeUser(function (user, done) {
    done(null, user.email);
});


//Deserializing fetches the user.email from the cookie-set
//Retrieving the information from the serialized format

//fetches the email from the req.session object and does the following action.
//After parsing the cookie and getting the session object with some properties like pageViews etc. 
// now it is time to do deserialize ie. opposite of string an user as a user.email -> retrieving 
// the user from user.email.

/* 
When subsequent requests are received, this email is used to find the user, 
which will be restored to req.user.
*/
passport.deserializeUser(function (email, done) {
    models.User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        done(null, user);
        //creates the object req.user
    })
});

/*

app.post('/login', passport.authenticate('local', 
{ 
	successRedirect: '/', 
	failureRedirect: '/login' 
})

Authenticating requests is as simple as calling passport.authenticate() and specifying which 
strategy to employ.

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });


By default, if authentication fails, Passport will respond with a 401 Unauthorized status, and any 
additional route handlers will not be invoked. If authentication succeeds, 
the next handler will be invoked and the req.user property will be set to the authenticated user.

Strategies must be configured prior to using them in a route.

Passport uses what are termed strategies to authenticate requests.
Before asking Passport to authenticate a request, the strategy (or strategies)
used by an application must be configured

Strategies, and their configuration, are supplied via the use() function. 
For example, the following uses the LocalStrategy for username/password authentication.

*/



/*

Verify Callback

Strategies require what is known as a verify callback. 
The purpose of a verify callback is to find the user that possesses a set of credentials.

When Passport authenticates a request or when passport.authenticate() is called, 
it parses the credentials contained in the request. It then invokes the verify callback with 
those credentials as arguments, in this case username and password. If the credentials are valid,
the verify callback invokes done to supply Passport with the user that authenticated.

*/

passport.use(new LocalStrategy({
	/*
		By default, LocalStrategy expects to find credentials in parameters named username and password. 
		If your site prefers to name these fields differently, options are available to change the defaults.
				
	*/ 
	usernameField: 'username',
	passwordField: 'password'
}, 
	/*
		passport.authenticate() -> parses the req.body.username and req.body.password and then invokes
		the verify callback with the credentials ie. req.body.username and req.body.password as the first
		and second arguments in the verify Callback function.
	*/


//Verify callback function
function (username, password, cb) {
    models.	UserLocal.findOne({
        where: {
            username: username
        },
        include: [models.User]
    }).then((userlocal) => {
        if (!userlocal) {
            return cb(null, false, {message: 'Wrong Username'})
        }

        if (userlocal.password == password) {
            return cb(null, userlocal.user)
        } else {
            return cb(null, false, {message: 'Wrong Password'})
        }

    }).catch((err) => {
        return cb(err, false);
    })
}));


passport.use(new BearerStrategy(function (token, done) {
    models.AuthToken.findOne({
        where: {
            token: token
        },
        include: [models.User]
    }).then((authtoken) => {

        if (authtoken && (authtoken.user)) {
            return done(null, authtoken.user)
        } else {
            return done(null, false, {message: 'Could not authorize'})
        }
    }).catch((err) => {
        return done(err, false)
    })
}));

module.exports = passport;