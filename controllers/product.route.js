const ProductModel = require('./../models/product.model');
const multer = require('multer');
// const upload = multer({
//     dest: './uploads/'
// })
const fs = require('fs');
const path = require('path');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

function filter(req, file, cb) {
    var mimeType = file.mimetype.split('/')[0];


    if (mimeType == 'image') {
        cb(null, true);
    } else {
        req.fileErr = true;
        cb(null, false);
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter: filter
});


const express = require('express');
const router = express.Router();


function map_product_req(product, productDetails) {
    if (productDetails.name)
        product.name = productDetails.name;
    if (productDetails.category)
        product.category = productDetails.category;
    if (productDetails.brand)
        product.brand = productDetails.brand;
    if (productDetails.description)
        product.description = productDetails.description;
    if (productDetails.price)
        product.price = productDetails.price;
    if (productDetails.color)
        product.color = productDetails.color;
    if (productDetails.weight)
        product.weight = productDetails.weight;
    if (productDetails.tags)
        product.tags = Array.isArray(productDetails.tags) ?
        productDetails.tags :
        productDetails.tags.split(',');
    // if (productDetails.warrentyStatus === 'true')

    //todo check datatype of boolean value
    // product.warrenty = {
    //     warrentyStatus: productDetails.warrentyStatus === 'true' ? true : false,
    //     warrentyPeriod: productDetails.warrentyPeriod
    // }

    product.warrenty = {};
    if (productDetails.warrentyStatus == 'true') {
        product.warrenty.warrentyStatus = productDetails.warrentyStatus
    }
    if (productDetails.warrentyPeriod) {
        product.warrenty.warrentyPeriod = productDetails.warrentyPeriod
    }

    // if (productDetails.discountedItem === 'true')
    product.discount = {
        discountedItem: productDetails.discountedItem ? true : false,
        discountType: productDetails.discountType,
        discount: productDetails.discount
    }
    if (productDetails.modelNo)
        product.modelNo = productDetails.modelNo;
    if (productDetails.image)
        product.image = productDetails.image;
    if (productDetails.manuDate)
        product.manuDate = productDetails.manuDate;
    if (productDetails.expiryDate)
        product.expiryDate = productDetails.expiryDate;
    if (productDetails.volume)
        product.volume = productDetails.volume;
    if (productDetails.quantity)
        product.quantity = productDetails.quantity;
    if (productDetails.origin)
        product.origin = productDetails.origin;
    if (productDetails.image)
        product.image = productDetails.image;
    return product;
}

module.exports = function (a, b, c) {


    router.route('/')
        .get(function (req, res, next) {
            ProductModel
                .find({
                    user: req.loggedInUser._id
                })
                // .find({
                //     user: req.loggedInUser._id
                // }, {
                //     name: 1,
                //     category: 1
                // })
                .populate('user', {
                    username: 1
                })
                .exec(function (err, products) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).json(products);
                })
        })
        .post(upload.single('img'), function (req, res, next) {
            // console.log('Directory', __dirname);
            // console.log('Root Dir', process.cwd());
            console.log('req.bdy', req.body);
            console.log('req.file', req.file);

            if (req.fileErr) {
                return next({
                    msg: 'Invalid file format'
                })
            }


            if (req.file) { //req.file huna saath server ma upload hunsa
                // var mimeType = req.file.mimetype.split('/')[0];
                // if (mimeType !== 'image') {

                //     fs.unlink(path.join(process.cwd(), 'files/images/' + req.file.filename), function (err, done) {
                //         if (err) {
                //             console.log('file removed failed')
                //         } else {
                //             console.log('file removed');
                //         }
                //     });
                //     fs.unlink();
                //     return next({
                //         msg: 'Invalid file format'
                //     })
                // }
                req.body.image = req.file.filename;
            }

            var newProduct = new ProductModel({});
            var newMappedProduct = map_product_req(newProduct, req.body);

            newMappedProduct.user = req.loggedInUser._id;
            newMappedProduct.save(function (err, saved) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(saved);
            });
        });

    router.route('/search')
        .get(function (req, res, next) {
            var condition = {};
            var searchCondition = map_product_req(condition, req.query);
            search(searchCondition)
                .then(function (data) {
                    res.json(data);
                })
                .catch(function (err) {
                    next(err);
                })
        })
        .post(function (req, res, next) {
            var condition = {};
            var searchCondition = map_product_req(condition, req.body);
            if (!req.body.warrentyStatus) {
                delete searchCondition.warrenty;
            }
            if (!req.body.discountedItem) {
                delete searchCondition.discount;
            }
            console.log('condition', searchCondition)
            search(searchCondition)
                .then(function (data) {
                    res.json(data);
                })
                .catch(function (err) {
                    next(err);
                })
        })


    router.route('/:id')
        .get(function (req, res, next) {
            ProductModel
                .findById(req.params.id)
                .exec(function (err, product) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).json(product);
                });
        })
        .put(upload.single('img'), function (req, res, next) {
            console.log('req.body', req.body);
            console.log('req.file', req.file);
            if (req.fileErr) {
                return next({
                    msg: 'Invalid file format'
                });
            }
            ProductModel.findById(req.params.id)
                .exec(function (err, product) {
                    if (err) {
                        return next(err);
                    }
                    if (!product) {
                        return next({
                            msg: 'Product not found'
                        });
                    }
                    var oldImage = product.image;
                    if (req.file) {
                        req.body.image = req.file.filename;
                    }

                    let updatedMapProduct = map_product_req(product, req.body);
                    if (req.body.ratingMsg && req.body.ratingPoint) {
                        updatedMapProduct.reviews.push({
                            user: req.loggedInUser._id,
                            message: req.body.ratingMsg,
                            point: req.body.ratingPoint
                        });
                    }

                    updatedMapProduct.save(function (err, updated) {
                        if (err) {
                            return next(err);
                        }
                        if (req.file) {
                            fs.unlink(path.join(process.cwd(), 'files/images/' + oldImage), function (err, done) {
                                if (err) {
                                    console.log('File removed err', err);
                                } else {
                                    console.log('Removed');
                                }
                            })
                        }

                        res.status(200).json(updated);
                    })
                })
        })
        .delete(function (req, res, next) {

            //remove file while deleting
            ProductModel
                .findById(req.params.id)
                .exec(function (err, product) {
                    if (err) {
                        return next(err);
                    }
                    if (product) {
                        product.remove(function (err, removed) {
                            if (err) {
                                return next(err);
                            }
                            res.status(200).json(removed);
                        })
                    } else {
                        next({
                            msg: 'Product not found'
                        });
                    }
                });
        });




    function search(query) {
        return new Promise(function (resolve, reject) {
            ProductModel.find(query)
                .exec(function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
        })
    }

    return router;
}