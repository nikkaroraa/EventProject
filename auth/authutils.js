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
function ensureUserIsId(dataField) {
    return function (req, res, next) {
        let data;
        if (dataField.param) {
            data = req.param(dataField.param)
        }
        if (dataField.query) {
            data = req.query(dataField.query)
        }
        if (req.user.id == data) {
            next()
        } else {
            res.send('You shall not pass')
        }
    }
}

module.exports = {
    ensureLogin,
    ensureAdmin,
    ensureUserIsId
};