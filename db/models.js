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


db.sync({force: false })
     .then(() => {
         console.log("Database Synchronised");
     })
	module.exports = {
     db,
     models: {
        User,
        Event,
        UserLocal
     }
 }; 
