const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
    console.log('This will always runs!');
    next();
});

app.get('/add-product', (req, res, next) => {
    console.log('products middleware');
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">save</button></form>');
});

app.post('/product', (req, res, next) => {
    console.log(req.body.title);
    res.redirect('/');
});

app.get('/', (req, res, next) => {
    console.log('Main middleware');
    res.send('<h1>Hello World from Express!</h1>');
});

app.listen(3000);