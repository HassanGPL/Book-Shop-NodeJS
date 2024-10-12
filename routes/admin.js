const express = require('express');

const isAuth = require('../middlewares/isAuth');
const adminController = require('../controllers/admin');
const { body } = require('express-validator');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product',
    [
        body('title', 'Please Enter a valid title').isString().isLength({ min: 5 }).trim(),
        body('imageUrl', 'Please Enter a valid URL').isURL().trim(),
        body('price', 'Please Enter a valid price').isFloat().trim(),
        body('description', 'Please Enter a valid description').isLength({ min: 10, max: 2000 }).trim()
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title', 'Please Enter a valid title').isString().isLength({ min: 5 }).trim(),
        body('imageUrl', 'Please Enter a valid URL').isURL().trim(),
        body('price', 'Please Enter a valid price').isFloat().trim(),
        body('description', 'Please Enter a valid description').isLength({ min: 10, max: 2000 }).trim()
    ],
    isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;