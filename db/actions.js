const db = require('./models').db;
const models = require('./models').models;




function signUp(name, email, username, password) {
    return models.UserLocal.create({
        username: username,
        password: password,
        user: {
            name: name,
            email: email
        }
    }, {
        include: [models.User]
    })
}


function addUser(name, email) {
    return models.User.create({
        name, email
    })
}

module.exports = {
    signUp,
    addUser
};      