const router = require('express').Router();
const User = require('../../db/models').models.User;

router.get('/', (req, res)=>{
	res.send('On /api/user route');
})

module.exports = router;