const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                products: products,
                title: 'Products',
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                title: product.title,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
}

exports.postCartAddProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(product => {
                return { quantity: product.quantity, product: { ...product.productId._doc } }
            });
            const order = new Order({
                user: {
                    userId: req.user._id,
                    username: req.user.name
                },
                products: products
            })
            return order.save()
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout',
        isAuthenticated: req.session.isLoggedIn
    });
}

