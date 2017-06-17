const router = require('express').Router();
const Event = require('../../db/models').models.Event;

router.get('/', (req, res)=>{
	res.send('On /api/event route');
})


router.post('/new', (req, res) => {
    //Add server-side validations if required here
    if (!req.body.name) {
        return res.status(403).send('Event cannot created without name')
    }

    // YYYY-MM-DD'T'HH:MM
    Event.create({
        name: req.body.title,
        venue: req.body.venue,
        imgUrl: req.body.imgUrl,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
        message: req.body.message,
		userId: 1 /*req.user.id*/

	})
	.then((event) => 
	{
		res.status(200).send(event);
	})
	.catch((err) => 
	{
        res.status(500).send("There was an error creating event")

	})
})
module.exports = router;