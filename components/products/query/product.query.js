const ProductModel = require('./../models/product.model');

function fetch(query, cb) {
    ProductModel.find(query)
        .exec(function (err, result) {
            if (err) {
                cb(err);
            } else {
                cb(null, result);
            }
        })

}

module.exports = {
    fetch
}