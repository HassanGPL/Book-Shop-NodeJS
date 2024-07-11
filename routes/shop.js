const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Main middleware');
    res.send('<h1>Hello World from Express!</h1>');
});

module.exports = router;