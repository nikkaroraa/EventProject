const router = require('express').Router();
const User = require('../../db/models').models.event;

router.get('/', (req, res)=>{
	res.send('On /api/event route');
})



module.exports = router;