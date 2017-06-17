const router = require('express').Router();
const dbActions = require('../db/actions');
const User = require('../db/models').models.User;
const passport = require('../auth/passport');
const el = require('../auth/authutils').ensureLogin;

router.get('/', (req, res)=>{
	res.send('On pages');
})

router.get('/signup', (req, res) => {
    res.render("signup", {});
});

router.post('/signup', (req, res) => {
    dbActions.signUp(
        req.body.name,
        req.body.email,
        req.body.username,
        req.body.password
    ).then((userlocal) => {
        res.redirect('/login')
    })
});

router.get('/login', (req, res) => {
    res.render("login", {})
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/profile'
}));

//using ensureLogin middleware to check if the user has logged in or not
router.get('/profile', el('/login'), (req, res) => {
        res.render("profile", {
            name: req.user.name,
            email: req.user.email
        });
});
/*


The question didn't clarify what type of session store was being used. Both answers seem to be correct.

For cookie based sessions:
From http://expressjs.com/api.html#cookieSession
req.session = null // Deletes the cookie.

For Redis, etc based sessions:
req.session.destroy // Deletes the session in the database.



*/
router.get('/logout', (req, res) => {
    req.user = null;
    req.logout();
    req.session.destroy(() => {
        res.redirect('/login')
    });

});

module.exports = router;