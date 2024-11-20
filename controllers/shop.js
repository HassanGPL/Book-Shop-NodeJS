const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    const page = req.query.page;
    let numItems;
    Product.find().countDocuments()
        .then(numProducts => {
            numItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        }).then(products => {
            res.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/',
                totalProducts: numItems,
                hasNextPage: ITEMS_PER_PAGE * page < numItems,
                hasPrevPage: page > 1,
                nextPageNum: page + 1,
                prevPageNum: page - 1,
                lastPageNum: Math.ceil(numItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                products: products,
                title: 'Products',
                path: '/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                title: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            console.log(products);
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postCartAddProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                    username: req.user.name,
                    email: req.user.email
                },
                products: products
            })
            return order.save()
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            console.log('PRODUCTS ORDERED SUCCESSFULLY!');
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout'
    });
}

exports.getInvoice = (req, res, next) => {
    const invoiceId = req.params.orderId;
    Order.findById(invoiceId)
        .then(order => {
            if (!order) {
                return next(new Error('No order with this ID'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }

            const invoiceName = 'invoice-' + invoiceId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(25).text('Invoice');
            pdfDoc.text('-----------------');

            totalPrice = 0;
            order.products.forEach(p => {
                totalPrice += (p.quantity * p.product.price);
                pdfDoc.fontSize(15).text('(' + p.product.title + ') ' + ' - ' + p.quantity + '  *   $' + p.product.price);
            });

            pdfDoc.text('-----------------');
            pdfDoc.text('Total Price = ' + totalPrice)

            pdfDoc.end();

        })
        .catch(err => next(err))
}