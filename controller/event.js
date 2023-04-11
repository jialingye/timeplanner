const express = require('express');
const mongoose = require('mongoose');
const router= express.Router();
const moment=require('moment');

//import the model
const Event = require('../model/event');
const eventSeed=require('../db/eventSeed');

//create route
router.post('/',async(req,res)=>{
    console.log(req.body)
    req.body.important=req.body.important==="on"? true:false;
    const {eventTitle,eventType,date,startTime,endTime,repeat,important,eventSublist}=req.body;
    console.log(eventSublist)
    const subtasks = eventSublist.map((task)=>{
        return {subtask: task}
    })
    console.log(subtasks)
    const start=moment(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A').toDate();
    const end=moment(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();
    try{
        const todoEvent= await Event.create({
            date,
            eventTitle,
            eventType,
            startTime:start,
            endTime:end,
            repeat,
            important,
            subtasks
        })
        console.log(todoEvent)
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
    const todo = await Event.findById(req.params.id)
    res.render('event/edit.ejs',{todo})
});

// Delete
router.delete('/:id', async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id)
    res.redirect('/daily')
});

// Update
router.put('/:id', async (req, res) => {
    req.body.important=req.body.important==="on"? true:false;
    const {eventTitle,eventType,date,startTime,endTime,repeat,important}=req.body;
    const eventSublist=req.body.eventSublist;
    console.log(req.body.eventSublist)
    console.log(eventSublist)
    const start=moment(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A').toDate();
    const end=moment(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A');

    console.log(eventSublist)
    const event = await Event.findByIdAndUpdate(req.params.id, {
        eventTitle,
        eventType,
        date,
        startTime: start,
        endTime:end,
        repeat,
        eventSublist,
        important
    }, {
        new: true
    })
    res.redirect('/event');
});

module.exports = router;

