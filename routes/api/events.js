const router = require('express').Router();
const Event = require('../../db/models').models.Event;
const authutils = require('../../auth/authutils');

router.get('/', (req, res) => {
    console.log(req.user);
    Event.findAll({
        attributes: ['id', 'name', 'startTime', 'endTime', 'venue', 'userId'],
    })
        .then((events) => {
            res.status(200).send(events)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send("Error retrieving events")
        })
});

router.post('/new', (req, res) => {
    //Add server-side validations if required here
    if (!req.body.name) {
        return res.status(403).send('Event cannot created without name')
    }

    // YYYY-MM-DD'T'HH:MM
    Event.create({
        name: req.body.name,
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

router.put('/:id', (req, res) => {
    Event.update({
            name: req.body.name,
            message: req.body.message,
            startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
            endTime: req.body.endTime ? new Date(req.body.endTime) : undefined,
            imgUrl: req.body.imgUrl,
            venue: req.body.venue,
        },
        {
            where: {
                id: req.params.id,
                userId: 1 /*req.user.id*/
            }
        }).then((updatedEvent) => {
            if (updatedEvent[0] == 0) {
                return res.status(403).send('Event does not exist, or you cannot edit it')
            } else {
                res.status(200).send('Event successfully edited')
            }

    })
});


router.delete('/:id', /*authutils.eia(),*/ (req, res) => {
    Event.destroy(
        {
            where: {
                id: req.params.id,
                userId: 1 /*req.userIsAdmin ?*/ /*req.user.id*/ //: undefined
            }
        }).then((destroyedRows) => {
        if (destroyedRows == 0) {
            return res.status(403).send('Event does not exist, or you cannot edit it')
        } else {
            res.status(200).send('Event successfully deleted')
        }

    })
});
module.exports = router;