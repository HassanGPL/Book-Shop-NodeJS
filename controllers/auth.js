const bcrypt = require('bcryptjs');
const User = require('../models/user');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: 'login',
        title: 'Login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password');
                return res.redirect('/login')
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        req.flash('error', 'Invalid Email or Password.');
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
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: 'signup',
        title: 'Signup',
        isAuthenticated: false,
        errorMessage: message
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
                req.flash('error', 'Email is already exist, please use another one');
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
                    return transporter.sendMail({
                        to: email,
                        from: 'evanadam1192@gmail.com',
                        subject: 'Congratulations! Signup Succeeded',
                        html: '<h1>You Successfully Signed Up!</h1>'
                    });
                }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: 'reset',
        title: 'Reset Password',
        isAuthenticated: false,
        errorMessage: message
    });
}