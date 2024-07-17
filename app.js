const path = require('path');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const express = require('express');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
// app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

app.listen(3000);