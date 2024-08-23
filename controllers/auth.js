exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie');
    res.render('auth/login', {
        path: 'login',
        title: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
};