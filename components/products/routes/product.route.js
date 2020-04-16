const router = require('express').Router();
const productCtrl = require('./../controllers/product.controller');

router.route('/')
    .get(productCtrl.find)

router.route('/:id')
    .get(productCtrl.findById)

module.exports = router;