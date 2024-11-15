const { validationResult } = require('express-validator')
const Product = require('../models/product');
const mongoose = require('mongoose');
const fileHelper = require('../utils/file')

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('admin/products', {
                products: products,
                title: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}



exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        edit: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
}



exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            title: 'Add Product',
            path: '/admin/add-product',
            edit: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image!',
            validationErrors: []
        });
    }

    const user = req.user;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: 'Add Product',
            path: '/admin/add-product',
            edit: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description,
                userId: user
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: user
    })

    product
        .save()
        .then(() => {
            console.log('PRODUCT CREATED SUCCESSFULLY!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}



exports.getEditProduct = (req, res, next) => {
    const edit = req.query.edit;
    if (edit !== "true") {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                edit: edit,
                hasError: false,
                product: product,
                errorMessage: null,
                validationErrors: []
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            edit: true,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description,
                _id: new mongoose.Types.ObjectId(productId)
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.description = description;

            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }

            return product.save()
                .then(() => {
                    console.log('PRODUCT UPDATED SUCCESSFULLY!');
                    res.redirect('/admin/products');
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then(product => {
        if (!product) {
            throw new Error('Product Not Found!')
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
        .then(result => {
            if (result.deletedCount > 0) {
                console.log('PRODUCT DELETED SUCCESSFULLY!');
                return res.redirect('/admin/products');
            }
            return res.redirect('/');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}