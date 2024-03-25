let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');

// get the register page
router.get('/register', (req, res) => {
    res.render('register', { 
        title: 'Register',
    });
});

// post the register page
router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
        if (err) {
            console.error('Error during registration:', err);
            return res.render('register', { 
                title: 'Register',
                errorMessage: 'An error occurred during registration. Please try again.',
            });
        } else {
            req.login(newUser, (err) => {
                if (err) {
                    console.error('Error during login:', err);
                    return res.redirect('/login');
                }
                res.redirect('/case');
            });
        }
    });
});

// get the login page
router.get('/login', (req, res) => {
    const messages = req.session.messages || [];
    req.session.messages = []; 
    res.render('login', { 
        title: 'Login',
        messages: messages,
        user: req.user
    });
});

// post the login page
router.post('/login', passport.authenticate('local', {
    successRedirect: '/details',
    failureRedirect: '/login',
}));

// render the logout function
router.get('/logout', (req, res) => {
    res.redirect('/login');
});

module.exports = router;
