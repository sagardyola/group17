const router = require('express').Router();

router.route('/')
    .get(function (req, res, next) {
        res.json({
            msg: 'From empty comment route'
        })
    })
    .post(function (req, res, next) {

    })
    .delete(function (req, res, next) {

    })
    .put(function (req, res, next) {

    });

module.exports = router;