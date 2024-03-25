const passport = require('passport');
const User = require('./models/user');

// set the auth with passport
let isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    return next();
};

module.exports = isAuthenticated;