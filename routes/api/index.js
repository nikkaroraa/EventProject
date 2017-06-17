const router = require('express').Router();

const eventRoute = require('./events');
const userRoute = require('./users');


router.use('/events', eventRoute);
router.use('/users', userRoute);


module.exports = router;

