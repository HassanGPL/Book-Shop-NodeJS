const http = require('http');
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

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => {
    console.log(`Server is Running with port number: ${port}`);
});