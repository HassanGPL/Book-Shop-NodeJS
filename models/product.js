const path = require('path');
const fs = require('fs');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getDataFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getDataFromFile(cb);
    }
} 