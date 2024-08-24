const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const express = require('express');

const User = require('./models/user');

const app = express();

const MONGO_URI = 'mongodb+srv://Hassan:IPRDyBxz3qLPC8f8@cluster.0oj0ppm.mongodb.net/shop'

const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'Hassan Ahmed', resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
    User.findById('66b9b6e5d0d30f1542de1bf3')
        .then(user => {
            req.session.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

mongoose.connect(MONGO_URI)
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Hassan',
                    email: 'Hassan@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000);
        console.log('DATABASE CONNECTED!');
    }).catch(err => console.log(err));