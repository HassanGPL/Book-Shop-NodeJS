const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/products-list', {
                products: products,
                title: 'Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                title: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
        }).then(products => {
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/products');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        title: 'Orders',
        path: '/orders'
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout'
    });
}

