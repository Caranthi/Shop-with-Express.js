const consts = require('../consts')
let express = require('express');
let router = express.Router();
const Product = require('../entities/Product')
const e = require("express");

router.get('/', async function (req, res, next) {
    const content = await Product.fetchAll({withRelated: [consts.category]});
    res.send(content);
});

router.get('/:id', async function (req, res, next) {
    try {
        const prductID = req.params.id;
        const product = await Product.where(consts.id, prductID).fetch({withRelated: [consts.category]});

        if (product) {
            res.status(consts.OK_CODE).json(product);
        } else {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Product not found'});
        }
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message})

    }
});

router.post('/', async function (req, res, next) {
    try {
        const productData = req.body;

        if (productData.price <= 0) {
            res.status(consts.BAD_REQUEST).json({message: 'Price must be greater than 0'});
            return;
        }
        if (productData.weight <= 0) {
            res.status(consts.BAD_REQUEST).json({message: 'Weight must be greater than 0'});
            return;
        }
        if (!productData.description) {
            res.status(consts.BAD_REQUEST).json({message: 'Product description must be set'});
            return;
        }
        if (!productData.name) {
            res.status(consts.BAD_REQUEST).json({message: 'Product name must be set'});
            return;
        }

        const product = await Product.forge(productData).save();

        res.status(consts.OK_CODE).json(product);
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const productID = req.params.id;
        const updatedProductData = req.body;

        if (updatedProductData.price <= 0) {
            res.status(consts.BAD_REQUEST).json({message: 'Price must be greater than 0'});
            return;
        }
        if (updatedProductData.weight <= 0) {
            res.status(consts.BAD_REQUEST).json({message: 'Weight must be greater than 0'});
            return;
        }
        if (!updatedProductData.description) {
            res.status(consts.BAD_REQUEST).json({message: 'Product description must be set'});
            return;
        }
        if (!updatedProductData.name) {
            res.status(consts.BAD_REQUEST).json({message: 'Product name must be set'});
            return;
        }

        const product = await Product.where(consts.id, productID).fetch();

        if (product) {
            await product.save(updatedProductData);
            res.status(consts.OK_CODE).json(await Product.where(consts.id, productID).fetch());
        } else {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Product not found'});
        }
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
});

module.exports = router;