const router = require('express').Router();
const Event = require('../../db/models').models.Event;
const authutils = require('../../auth/authutils');
const EventInvitee = require('../../db/models').models.EventInvitee;
const Invitee = require('../../db/models').models.Invitee;

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
	{	console.log(event);
		if (req.body.invitees) {
            let invitees = req.body.invitees.split(';');
            invitees = invitees.map((i) => {
                return {email: i.trim()}
                /*
                returning an object with email key as the bulkCreate statement 
                needs to be executed with Invitee.bulkCreate({email: inviteeEmail})
                just like create({}) syntax
            	*/
            });
            Invitee.bulkCreate(invitees, {
                ignoreDuplicates: true
            })
                .then((invitees) => {
                    let eventInvitee = invitees.map((i) => {
                        return {
                            eventId: event.id,
                            inviteeId: i.id
                        }
                    });

                    EventInvitee.bulkCreate(eventInvitee, {
                        ignoreDuplicates: true
                    })
                        .then((eiArr) => {
                            res.status(200).send(event)
                            
                            

                        })
                })
        } else {
            res.status(200).send(event)
		}
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


router.get('/:id/invitees', (req, res) => {
    EventInvitee.findAll({
        attributes: ['id'],
        where: {
            eventId: req.params.id,
            '$event.userId$': 1 /*req.user.id*/, 
            /*
            Used in this way so as to find the event.userId from the Event model that is linked 
            with EventInvitee model
        	*/
        },
        include: [{
            model: Invitee,
            as: 'invitee',
            attributes: ['id', 'email']
        }, {
            model: Event,
            as: 'event',
            attributes: ['id', 'userId']
        }]
    }).then((invitees) => {
        if (invitees) {
            res.status(200).send(invitees)
        } else {
            res.status(500).send('No invitees found for this event')
        }
    })
});

router.put('/:id/invitees', (req, res) => {
    let invitees = req.body.invitees.split(';');
    invitees = invitees.map((i) => {
        return {email: i.trim()}
        /*
	        returning an object with email key as the bulkCreate statement 
	        needs to be executed with Invitee.bulkCreate({email: inviteeEmail})
	        just like create({}) syntax
		*/
    });
    Invitee.bulkCreate(invitees, {
        ignoreDuplicates: true
    })
        .then((invitees) => {
            let eventInvitee = invitees.map((i) => {
                return {
                    eventId: req.params.id,
                    inviteeId: i.id
                }
            });

            EventInvitee.bulkCreate(eventInvitee, {
                ignoreDuplicates: true
            })
                .then((eiArr) => {
                    res.status(200).send({
                        newInvitees: eiArr
                    })
                })
        })
});
module.exports = router;