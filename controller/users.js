const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const {SALT}=require('../config');
const session = require('express-session')
const MongoStore = require('connect-mongo')
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
        // console.log("email: "+req.body.email)
        // console.log("user exist"+userExists)
        if(userExists) {
            user = await User.findOne({email: req.body.email});
            // console.log("user"+user)
        } else {
            failedLogin = "Your username or password didn't match"
            // console.log("can't find your username")
            return res.redirect('/user/login');
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        console.log("match" + match)
        if(match) {
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            console.log(req.session);
            console.log(match);
            console.log(userExists);
            res.redirect('/event');
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
        const rounds = SALT;
        const salt = await bcrypt.genSalt(parseInt(rounds));
        // console.log(`My salt is ${salt}`);
        const hash = await bcrypt.hash(newUser.password, salt);
        // console.log(`My hash is ${hash}`);
        newUser.password = hash;
        // console.log(newUser);
        await User.create(newUser);
        res.redirect('/user/login');
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
})

module.exports = router;