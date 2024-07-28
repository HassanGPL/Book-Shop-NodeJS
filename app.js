const path = require('path');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const User = require('./models/user');
const Product = require('./models/product');

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    .sync({ force: true })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
