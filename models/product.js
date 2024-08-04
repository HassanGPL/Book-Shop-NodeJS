const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this)
            .then(result => {
                console.log(result);

            })
            .catch(err => {
                console.log(err);
            });
    }

    static findAll() {
        const db = getDb();
        return db.collection('products').find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(id) {
        const db = getDb();
        const objectId = new mongodb.ObjectId(id);
        return db.collection('products').findOne({ _id: objectId })
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    updateById(id) {
        const db = getDb();
        const productId = new mongodb.ObjectId(id);
        return db.collection('products').updateOne({ _id: productId }, { $set: this })
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });

    }

    static deleteById(id) {
        const db = getDb();
        const productId = new mongodb.ObjectId(id);
        return db.collection('products').deleteOne({ _id: productId }, true)
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }

}

module.exports = Product;