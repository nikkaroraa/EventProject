const router = require('express').Router();

const eventRoute = require('./events');
const userRoute = require('./users');
const inviteesRoute = require('./invitees');

router.use('/events', eventRoute);
router.use('/users', userRoute);
router.use('/invitees', inviteesRoute);

module.exports = router;

