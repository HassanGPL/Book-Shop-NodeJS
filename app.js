const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'page-not-found.html'))
});

app.listen(3000);