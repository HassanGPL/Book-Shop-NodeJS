exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split('=')[1];
    res.render('auth/login', {
        path: 'login',
        title: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'isLoggedIn=true');
    res.redirect('/');
};