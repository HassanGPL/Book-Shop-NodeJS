const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('Middleware 1');
    next();
});

app.use((req, res, next) => {
    console.log('Middleware 2');
    res.send('<h>Hello World with Express!</h>')
});

app.listen(3000);