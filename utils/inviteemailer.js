const nodemailer = require('nodemailer');

const sendmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'nagarroevman@gmail.com',
        pass: 'bootcamp'
    }
});

function createInvite(inviteeEmail) {
    return {
        from: 'narora200@gmail.com',
        to: (typeof inviteeEmail == 'string') ? inviteeEmail : inviteeEmail.join(','),
        subject: 'You are invited to an event',
        html: "<h3> Please come there's free lunch </h3>"
    }
}

function sendInvite(inviteeEmail, done) {
    sendmail.sendMail(createInvite(inviteeEmail), (err, info) => {
        if (err) {
            throw err
        }
        if (done) {
            done(info);
        }
    })
}

module.exports = {
    sendInvite
};