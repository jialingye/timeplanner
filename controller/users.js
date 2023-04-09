const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
let failedLogin

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/login', async(req, res, next) => {
    try {
        let user;
        const userExists = await User.exists({email: req.body.email});
        if(userExists) {
            user = await User.findOne({email: req.body.email});
            // console.log(user)
        } else {
            failedLogin = "Your username or password didn't match"
            return res.redirect('/login');
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if(match) {
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            // console.log(req.session);
            // console.log(match);
            // console.log(userExists);
            res.redirect('/fruits');
        } else {
            failedLogin = "Your username or password didn't match"
            res.redirect('/login');
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

router.post('/signup', async(req, res, next) => {
    try {
        const newUser = req.body;
        // console.log(newUser);
        const rounds = process.env.SALT_ROUNDS
        const salt = await bcrypt.genSalt(parseInt(rounds));
        // console.log(`My salt is ${salt}`);
        const hash = await bcrypt.hash(newUser.password, salt);
        // console.log(`My hash is ${hash}`);
        newUser.password = hash;
        // console.log(newUser);
        await User.create(newUser);
        res.redirect('/login');
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

module.exports = router;