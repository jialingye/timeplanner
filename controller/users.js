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
        //find user exist
        const userExists = await User.exists({email: req.body.email});
        
        //if exists, find the one in mongodb
        if(userExists) {
            user = await User.findOne({email: req.body.email});
        } else {
            failedLogin = "Your username or password didn't match"
            return res.redirect('/user/login');
        }
        //if user match, compare password
        const match = await bcrypt.compare(req.body.password, user.password);
        //if password match, then create session
        if(match) {
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            
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
        //creat user and rounds of salt
        const newUser = req.body;
        //creat hash on user password depends on SALT number
        const rounds = SALT;
        const salt = await bcrypt.genSalt(parseInt(rounds));

        const hash = await bcrypt.hash(newUser.password, salt);

        newUser.password = hash;
        
        //if user not already exist, create user
        const existUser = await User.findOne({email: newUser.email});
        if(existUser){
             res.status(400).json({error: 'Email already exists'})
        } else {
            await User.create(newUser);
            res.redirect('/user/login');
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;