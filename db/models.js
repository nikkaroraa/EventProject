const Sequelize = require('sequelize');

const db = new Sequelize('eventman', 'eventadmin', 'eventpass', {
	host: 'localhost',
	dialect: 'mysql'
})

const Event = db.define('event', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE,
    hostMessage: Sequelize.STRING,
    venue: Sequelize.STRING
});

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

const Invitee = db.define('invitee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        index: true
        /*
        A very good analogy is to think 
        of a database index as an index in a book. 
        If you have a book regarding countries and you are looking for India, 
        then why would you flip through the entire book – which is the equivalent 
        of a full table scan in database terminology – when you can just go to the 
        index at the back of the book, which will tell you the exact pages where you 
        can find information on India. Similarly, as a book index contains a page number, a
        database index contains a pointer to the row containing the value that you are searching 
        for in your SQL. 
        */
    }
});

const EventInvitee = db.define('eventinvitee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rsvp: Sequelize.BOOLEAN,
    token: Sequelize.STRING
});

EventInvitee.belongsTo(Event);
Event.hasMany(EventInvitee);
EventInvitee.belongsTo(Invitee);
Invitee.hasMany(EventInvitee);

const UserLocal = db.define('userlocal', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING
});

Event.belongsTo(User);
User.hasMany(Event);

UserLocal.belongsTo(User);
User.hasOne(UserLocal);


const AuthToken = db.define('authtoken', {
    token: {
        type: Sequelize.STRING,
        primaryKey: true
    }
});

AuthToken.belongsTo(User);
User.hasMany(AuthToken);

db.sync({force: false})
     .then(() => {
         console.log("Database Synchronised");
     })
	module.exports = {
     db,
     models: {
        User,
        Event,
        Invitee,
        EventInvitee,
        UserLocal,
        AuthToken
     }
 }; 
