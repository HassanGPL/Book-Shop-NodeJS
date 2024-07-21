const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(productId, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            const existingProduct = cart.products[existingProductIndex];

            if (existingProduct) {
                existingProduct.qty = existingProduct.qty + 1
            } else {
                let newProduct = { id: productId, qty: 1 };
                cart.products = [...cart.products, newProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }


    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }

            const cart = JSON.parse(fileContent);
            const product = cart.products.find(product => product.id === id);

            if (product) {
                cart.products = cart.products.filter(p => p.id !== id);
                cart.totalPrice = cart.totalPrice - (product.qty * price);
            }

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });

        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                let cart = JSON.parse(fileContent);
                cb(cart)
            }
        });
    }
};