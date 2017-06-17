function ensureLogin(fallbackPath) {

    return function (req, res, next) {

        if (!req.user) {
            res.redirect(fallbackPath)
        } else {
            next()
        }
    }
}


function ensureAdmin(fallbackPath) {

    return function (req, res, next) {

        if (req.user && req.user.role == 'admin') {
            next()
        } else {
            res.redirect(fallbackPath)
        }
    }
}


module.exports = {
    ensureLogin
};