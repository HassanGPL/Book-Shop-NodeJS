const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');

const express = require('express');

const User = require('./models/user');

const app = express();

const MONGO_URI = 'mongodb+srv://Hassan:IPRDyBxz3qLPC8f8@cluster.0oj0ppm.mongodb.net/shop'

const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'Hassan Ahmed', resave: false, saveUninitialized: false, store: store }));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(3000);
        console.log('DATABASE CONNECTED!');
    }).catch(err => console.log(err));