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

    static findById(userId) {
        const db = getDb();
        const userMongoId = new mongodb.ObjectId(userId);
        return db.collection('users').findOne({ _id: userMongoId });
    }
}

module.exports = User;