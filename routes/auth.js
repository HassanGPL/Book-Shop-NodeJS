const express = require('express');

const authController = require('../controllers/auth');

const { check, body } = require('express-validator');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    check('email', 'Please enter a valid E-mail.')
        .isEmail(),
    body('password', 'Please Enter a Password contains at least 8 character')
        .isLength({ min: 8 }),
    authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    check('email', 'Please enter a valid E-mail.')
        .isEmail()
        .custom((value) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email is already exist, please use another one');
                    }
                })
        }),
    body('password', 'Please Enter a Password contains at least 8 character')
        .isLength({ min: 8 }),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ,
    authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;