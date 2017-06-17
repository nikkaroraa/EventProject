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
