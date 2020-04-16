const productQuery = require('./../query/product.query');

function find(req, res, next) {
    var condition = {};
    if (req.loggedInUser.role !== 1) {
        condition.user = req.loggedInUser._id;
    }

    productQuery.fetch(condition, function (err, results) {
        if (err) {
            return next(err);
        }
        res.status(200).json(results);
    })
}

function findById(req, res, next) {

    var condition = {
        _id: req.params.id
    };


    productQuery.fetch(condition, function (err, results) {
        if (err) {
            return next(err);
        }
        res.status(200).json(results[0]); //results comes in array so [0] is used for object
    });
}

module.exports = {
    find,
    findById
}