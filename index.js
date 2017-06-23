const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const passport = require('./auth/passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');

const app = express();

app.use(cors());
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/*
	Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 
	Optionally you may enable signed cookie support by passing a secret string, 
	which assigns req.secret so it may be used by other middleware.
*/
app.use(cookieParser('abracadabra'));
/*	
	CookieParser(secret, options)

    secret a string or array used for signing cookies. This is optional and if not specified, 
    will not parse signed cookies. If a string is provided, this is used as the secret. 
    If an array is provided, an attempt will be made to unsign the cookie with each secret in order.
    options an object that is passed to cookie.parse as the second option. See cookie for more information.
    decode a function to decode the value of the cookie

	Signed Cookies:
	The cookie will still be visible, but it has a signature, so it can detect if the client 
	modified the cookie. It works by creating a HMAC of the value (current cookie), and base64 encoded it.
	When the cookie gets read, it recalculates the signature and makes sure that it matches the 
	signature attached to it. If it does not match, then it will give an error.
	
	HMAC:
	In cryptography, a keyed-hash message authentication code (HMAC) is a specific type of message 
	authentication code (MAC) involving a cryptographic hash function and a secret cryptographic key.
	
	MAC: 
	In cryptography, a message authentication code (MAC) is a short piece of information used to authenticate 
	a message—in other words, to confirm that the message came from the stated sender (its authenticity) 
	and has not been changed (sometimes known as a tag).

	Base64:
	It's basically a way of encoding arbitrary binary data in ASCII text.Essentially each 6 bits of 
	the input is encoded in a 64-character alphabet. The "standard" alphabet uses A-Z, a-z, 0-9 and + and /, 
	with = as a padding character. There are URL-safe variants.
*/



/*
There are two broad ways of implementing sessions in Express – 
using cookies and using a session store at the backend. Both of them add a new object in the request 
object named session, which contains the session variables.

No matter which method you use, Express provides a consistent interface for working with the session data.
*/

	

/*
Sessions:
The secret is a random, high-entropy string you create to encrypt the cookie. We need to take this step 
because the browser is an inherently untrusted environment; anyone with access can open it up and see 
what’s stored in there. Client-sessions will encrypt and decrypt all the cookie values, 
so you don’t have to worry about prying eyes.

A session secret in is simply used to compute the hash. Without the string, 
access to the session would essentially be "denied".
*/
app.use(expressSession({
    secret: 'abracadabra',
    resave: false,
    saveUninitialized: false,
}));


//passport has to be intialized before using
/*
	In a Connect or Express-based application, passport.initialize() middleware is required 
	to initialize Passport. If your application uses persistent login sessions, 
	passport.session() middleware must also be used.
*/


/*
	Persistent cookies are stored in a text file on the clients computer.
	Non-Persistent cookies are stored in RAM on the client and are destroyed when the browser is closed.
*/

app.use(passport.initialize());
app.use(passport.session());


app.use('/api', require('./routes/api'));
app.use('/', require('./routes/pages'));



app.listen(2345, function(){
	console.log("Listening on port 2345");
})