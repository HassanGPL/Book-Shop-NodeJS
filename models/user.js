const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
    constructor(username, email, cart, _id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = _id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const db = getDb();

        const updatedCart = this.cart;
        if (!updatedCart.totalPrice) {
            updatedCart.totalPrice = 0;
        }
        if (!updatedCart.items) {
            updatedCart.items = [];
        }

        const productIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() === product._id.toString();
        })

        if (productIndex >= 0) {
            updatedCart.items[productIndex].quantity++;
        }
        else {
            updatedCart.items.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
        }

        updatedCart.totalPrice = updatedCart.totalPrice + +product.price;

        return db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb()

        const productIds = this.cart.items.map(item => {
            return item.productId;
        });

        return db.collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === p._id.toString();
                        }).quantity
                    }
                })
            })
    }

    static findById(userId) {
        const db = getDb();
        const userMongoId = new mongodb.ObjectId(userId);
        return db.collection('users').findOne({ _id: userMongoId });
    }
}

module.exports = User;