const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const express = require('express');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('66b1535ca99387ee2b32cbb5')
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user._id);
            req.userId = user._id;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://Hassan:IPRDyBxz3qLPC8f8@cluster.0oj0ppm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster').then(() => {
    app.listen(3000);
    console.log('DATABASE CONNECTED!');
});