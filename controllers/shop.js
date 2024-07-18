const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            products: products,
            title: 'Shop',
            path: '/'
        });
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/products-list', {
            products: products,
            title: 'Products',
            path: '/products'
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        title: 'Cart',
        path: '/cart'
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout'
    });
}

