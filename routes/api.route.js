const authRoute = require('./../controllers/auth.route');
const userRoute = require('./../controllers/user.route');
const commentRoute = require('./../controllers/comment.route');
const productRoute = require('./../controllers/product.route')();

const authentication = require('./../middlewares/authenticate');
const authorization = require('./../middlewares/authorize');

const newProductRoute = require('./../components/products/routes/product.route');

module.exports = function () {
    const router = require('express').Router();
    router.use('/auth', authRoute);
    router.use('/user', authentication, userRoute);
    router.use('/comment', authentication, authorization, commentRoute);
    router.use('/product', authentication, productRoute);

    router.use('/new-product', authentication, newProductRoute);
    return router;
}