const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('register', { 
        title: 'Register',
    });
});

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

router.get('/login', (req, res) => {
    const messages = req.session.messages || [];
    req.session.messages = []; 
    res.render('login', { 
        title: 'Login',
        messages: messages,
        user: req.user
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/details',
    failureRedirect: '/login',
}));


module.exports = router;
