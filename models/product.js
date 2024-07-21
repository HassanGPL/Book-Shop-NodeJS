const path = require('path');
const fs = require('fs');
const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getDataFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getDataFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(p => p.id === this.id);
                products[existingProductIndex] = this
            } else {
                this.id = Math.random().toString();
                products.push(this);
            }

            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static deleteById(id) {
        getDataFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getDataFromFile(cb);
    }

    static findById(id, cb) {
        getDataFromFile(products => {
            const product = products.find(product => product.id === id);
            cb(product);
        });
    }
} 