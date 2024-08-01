const path = require('path');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const express = require('express');

const mongoConnect = require('./utils/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// const shopRouter = require('./routes/shop');
// const adminRouter = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
});

app.use('/', (req, res, next) => {
    next();
});

// app.use('/admin', adminRouter);
// app.use(shopRouter);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});