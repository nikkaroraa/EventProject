const router = require('express').Router();
const User = require('../../db/models').models.User;
const models = require('../../db/models').models;
const passport = require('../../auth/passport');
const authutils = require('../../auth/authutils');

router.get('/',
    passport.authenticate('bearer'),
    (req, res) => {
    console.log(req)
    models.User.findAll().then((users) => {
        res.send(users);
    })
});

router.get('/:id',
    passport.authenticate('bearer'), 
    /*
	    runs the Bearer Auth strategy and populates req.user with the 2nd 
	    parameter of the callback function (check config of beaer strategy in passport.js)
    */
    (req, res) => {
    models.User.findOne({
        where: {
            id: req.params.id
        }
    }).then((user) => {
        res.send(user);
    })
});

//Show the details to only the user who is the owner of those details.
//That is why using 2 middlewares: middleware chaining
router.get('/:id/details',
    passport.authenticate('bearer'),
    authutils.ensureUserIsId({
        param: 'id'
    }),
    (req, res) => {
    models.User.findOne({
        where: {
            id: req.params.id
        },
        include: [models.UserLocal]
    }).then((user) => {
        res.send(user)
    })
 });
module.exports = router;