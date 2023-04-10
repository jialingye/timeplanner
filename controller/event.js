const express = require('express');
const mongoose = require('mongoose');
const router= express.Router();
const moment=require('moment');

//import the model
const Event = require('../model/event');
const eventSeed=require('../db/eventSeed');

//create route
router.post('/',async(req,res)=>{
    const {eventTitle,eventType,date,startTime,endTime,repeat,important}=req.body;
    req.body.important=req.body.important==="on"? true:false;
    console.log(date,startTime,endTime)
    const start=moment(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A').toDate();
    const end=moment(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();
    console.log(date,eventTitle)
    console.log(start)
    console.log(end)

    try{
        const todoEvent= await Event.create({
            date,
            eventTitle,
            eventType,
            startTime:start,
            endTime:end,
            repeat,
            important
        })
        res.redirect('/daily')
    } catch (err){
        res.send('Error massage: '+ err)
    }
})

//index route
router.get('/', async(req,res) =>{
    const events= await Event.find({})
    res.render('index',{events})
})

//Seed
router.get('/seed',async(req,res)=>{
    try {
              // Delete all existing events
              await Event.deleteMany({});
          
              // Seed the database with the example events
              await Event.create(eventSeed);
          
              // Redirect to the events index page
              res.redirect('/event');
            } catch (err) {
              console.error(err);
              res.send('Error message: ' + err);
            }
})

// New
router.get('/new',(req,res)=>{
    res.render('event/new.ejs')
})

// Show
router.get('/:id', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
      res.render('event/show.ejs', { event })
    } catch (error) {
      console.error(error)
      res.status(500).send('An error occurred while retrieving the event')
    }
  })

// Edit
router.get('/:id/edit', async(req,res)=>{
    const event = await Event.findById(req.params.id)
    res.render('event/edit.ejs',{event})
});

// Delete
router.delete('/:id', async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id)
    res.redirect('/daily')
});

// Update
router.put('/:id', async (req, res) => {
    const {eventTitle,eventType,date,startTime,endTime,repeat,important}=req.body;
    console.log('date:'+ date,'start time'+startTime,'end time'+endTime)
    const start=moment(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A').toDate();
    const end=moment(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();
    req.body.important=req.body.important==="on"? true:false;
    const event = await Event.findByIdAndUpdate(req.params.id, {
        eventTitle,
        eventType,
        date,
        startTime: start,
        endTime:end,
        repeat,
        important
    }, {
        new: true
    })
    res.redirect('/event');
});

module.exports = router;

