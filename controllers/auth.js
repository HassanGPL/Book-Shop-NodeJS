const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: 'login',
        title: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login')
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return res.redirect('/login');
                    }
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session
                        .save(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: 'signup',
        title: 'Signup',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        name: name,
                        email: email,
                        phoneNumber: phoneNumber,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return newUser.save();
                })
                .then(() => {
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};