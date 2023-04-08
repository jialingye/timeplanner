const express = require('express');
const mongoose = require('mongoose');
const router= express.Router();

//import the model
const Event = require('../model/event');
const eventSeed=require('../db/eventSeed');

//create route
router.post('/',async(req,res)=>{
    req.body.important=req.body.important==="on"? true:false;
    try{
        const todoEvent= await Event.create(req.body)
        res.redirect('/daily')
    } catch (err){
        res.send('Error massage: '+err)
    }
})

//index route
router.get('/', async(req,res) =>{
    const events= await Event.find({})
    console.log(events)
    res.render('index',{events})
})

//Seed
router.get('/seed',async(req,res)=>{
    try {
              // Delete all existing events
              await Event.deleteMany({});
          
              // Seed the database with the example events
              await Event.create(eventSeed);
              console.log(eventSeed)
          
              // Redirect to the events index page
              res.redirect('/event');
            } catch (err) {
              console.error(err);
              res.send('Error message: ' + err);
            }
})

// New
router.get('/new',(req,res)=>{
    res.render('new.ejs')
})

// Show
router.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id)
    res.render('show.ejs',{event});
});

// Edit
router.get('/:id/edit', async(req,res)=>{
    const event = await Event.findById(req.params.id)
    res.render('edit.ejs',{event})
})

// Delete
router.delete('/:id', async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id)
    res.redirect('/daily')
});

// Update
router.put('/:id', async (req, res) => {
    req.body.important=req.body.important==="on"? true:false;
    const event = await Animal.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    res.redirect('/daily');
});

module.exports = router;

