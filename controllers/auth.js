const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { Resend } = require('resend');
const { validationResult } = require('express-validator');

const resend = new Resend('re_5CwZVb6h_B6Xxr88dbMe2W3N8VKa4p2jM');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('auth/login', {
        path: 'login',
        title: 'Login',
        isAuthenticated: false,
        errorMessage: message,
        oldData: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.render('auth/login', {
            path: 'login',
            title: 'Login',
            errorMessage: errors.array()[0].msg,
            oldData: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.render('auth/login', {
                    path: 'login',
                    title: 'Login',
                    errorMessage: 'Invalid Email or Password.',
                    oldData: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return res.render('auth/login', {
                            path: 'login',
                            title: 'Login',
                            errorMessage: 'Invalid Email or Password.',
                            oldData: {
                                email: email,
                                password: password
                            },
                            validationErrors: []
                        });
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
        errorMessage: message,
        oldData: {
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: 'signup',
            title: 'Signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldData: {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        })
    }

    bcrypt
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
            return resend.emails.send({
                from: 'nodejs@resend.dev',
                to: email,
                subject: 'Congratulations! Signup Succeeded',
                html: '<h1>You Successfully Signed Up!</h1>'
            });
        }).catch(err => console.log(err));
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

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'this user is does not exist.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
                    .then(() => {
                        res.redirect('/');
                        return resend.emails.send({
                            to: email, // Change to your recipient
                            from: 'nodejs@resend.dev', // Change to your verified sender
                            subject: 'Password Reset',
                            text: 'Node.js',
                            html: `
                                <h1>You requested to reset password</h1>
                                <h4>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to reset your password</h4>
                                `
                        });
                    })
            })
            .catch(err => console.log(err));
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: 'new-password',
                title: 'New Password',
                isAuthenticated: false,
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: user.resetToken
            });
        })
        .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const token = req.body.passwordToken;

    let resetUser;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
}