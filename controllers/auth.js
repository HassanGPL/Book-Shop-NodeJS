const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: 'login',
        title: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('66b9b6e5d0d30f1542de1bf3')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
};