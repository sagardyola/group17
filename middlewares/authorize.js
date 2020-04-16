module.exports = function (req, res, next) {
    // if (req.query.token == 'ram') {
    //     return next();
    // } else {
    //     nezt({
    //         msg: 'invalid token'
    //     })
    // }

    if (req.loggedInUser.role === 1) {
        return next();
    } else {
        next({
            msg: 'You dont have permisssion'
        })
    }
}