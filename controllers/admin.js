const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                products: products,
                title: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        edit: false,
        isAuthenticated: req.isLoggedIn
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const user = req.user;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: user
    })

    product
        .save()
        .then(result => {
            console.log('PRODUCT CREATED SUCCESSFULLY!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
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
                product: product,
                isAuthenticated: req.isLoggedIn
            });
        }).catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    Product.findByIdAndUpdate(productId, {
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
    }).then(product => {
        console.log('PRODUCT UPDATED SUCCESSFULLY!');
        res.redirect('/admin/products');
    })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndDelete(productId)
        .then(result => {
            console.log('PRODUCT DELETED SUCCESSFULLY!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}