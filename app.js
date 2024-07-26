const path = require('path');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const db = require('./utils/database');

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

app.listen(3000);