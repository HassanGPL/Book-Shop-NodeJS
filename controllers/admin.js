const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                products: products,
                title: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        edit: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
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
    req.user.getProducts({ where: { id: productId } })
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                edit: edit,
                product: product
            });
        }).catch(err => console.log(err));

}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    Product.update({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }, { where: { id: productId } })
        .then(result => {
            console.log('PRODUCT UPDATED SUCCESSFULLY!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.destroy({ where: { id: productId } })
        .then(result => {
            console.log('PRODUCT DELETED SUCCESSFULLY!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}