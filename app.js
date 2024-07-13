const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');

const shopRouter = require('./routes/shop');
const adminData = require('./routes/admin');

const app = express();

app.set('view engine', 'pug');
// app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminData.router);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page not found' });
});

app.listen(3000);