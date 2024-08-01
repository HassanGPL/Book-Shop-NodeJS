const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://Hassan:IPRDyBxz3qLPC8f8@cluster.0oj0ppm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster')
        .then((client) => {
            console.log('CONNECTED SUCCESSFULLY!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err)
            throw err;
        })
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'NO DATABASE FOUNDED!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;