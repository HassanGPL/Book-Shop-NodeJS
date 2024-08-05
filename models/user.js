const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        const userMongoId = new mongodb.ObjectId(userId);
        return db.collection('users').findOne({ _id: userMongoId });
    }
}

module.exports = User;