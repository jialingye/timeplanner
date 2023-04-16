const express = require('express');
const mongoose = require('mongoose');
const router= express.Router();
const moment=require('moment-timezone');


//import the model
const Event = require('../model/event');
const eventSeed=require('../db/eventSeed');

//create route
router.post('/',async(req,res)=>{
    req.body.completed=req.body.completed==="on"? true:false;
    const {eventTitle,eventType,date,startTime,endTime,completed,subtasks}=req.body;
    // const subtaskArr = subtasks.map((task)=>{
    //     return {subtask: task}
    // })
    const start=(moment(`${date}${startTime}`,'YYYY-MM-DD hh:mm A')).toDate();
    // console.log('start',moment.tz(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A','America/Hawaii').toDate())
    // console.log('end',moment.tz(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A','America/Hawaii').toDate())
    const end=moment(`${date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();
    // const start=`${date}T${startTime}:00.000Z`;
    // const end=`${date}T${endTime}:00.000Z`;
    try{
        const todoEvent= await Event.create({
            date,
            eventTitle,
            eventType,
            startTime:start,
            endTime:end,
            completed,
            subtasks
        })
        res.redirect('/event')
    } catch (err){
        res.send('Error massage: '+ err)
    }
})

//index route
router.get('/', async(req,res) =>{
    const events = await Event.find({})
    res.render('index',{events})
})

router.get('/incomplete', async(req,res) =>{
    const incomplete = await Event.find({completed:false})
    res.render('type/incomplete',{incomplete})
})

//search route
router.get('/type', async(req,res) =>{
  const eventType = req.query.eventType ;
  const completed = req.query.completed;
  const date = req.query.date;

  const query={};
  if(eventType){
    query.eventType = eventType;
  }
  if (completed){
    query.completed = completed;
  }
  if(date){
    query.date = date;
  }

  try{
    const events=await Event.find(query);
    res.render ('type/eventtype', {events});
  } catch (err) {
    console.error(err);
    res.status(500).send('server error')
  }
})

router.get('/date', async(req,res) =>{
    const date = req.query.date ;
    const query={};
    if(date){
      query.date = date;
    }
    try{
      const events=await Event.find(query);
      res.render ('type/date', {events});
    } catch (err) {
      console.error(err);
      res.status(500).send('server error')
    }
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

// Show
router.get('date/:date', async (req, res) => {
    try {
      const {date} = req.params;
      const events = await Event.findById({date: date})
      res.render('type/date.ejs', { events })
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
    res.redirect('/event')
});

// Update
router.put('/:id', async (req, res) => {
    req.body.completed=req.body.completed==="on"? true:false;
    const {eventTitle,eventType,date,startTime,endTime,subtasks, completed}=req.body;
    const todo= await Event.findById(req.params.id);
    console.log(todo.subtasks)
    todo.subtasks = req.body.newSubtasks  ? [...todo.subtasks, ... req.body.newSubtasks]:todo.subtasks;
    console.log(todo.subtasks)

    // const start=new Date(`${date}${startTime}`)
    const start=(moment(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A')).toDate();
    // console.log('start',moment.tz(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A','America/Hawaii').toDate())
    // console.log('end',moment.tz(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A','America/Hawaii').toDate())
    const end=moment(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();

    // const start=new Date(`${date}T${startTime}:00.000Z`);
    // const end=new Date(`${date}T${endTime}:00.000Z`);
    // console.log(start, end )
    
await todo.save();
console.log(start,end)
    const event = await Event.findByIdAndUpdate(req.params.id, {
        eventTitle,
        eventType,
        date,
        startTime: start,
        endTime: end,
        subtasks,
        completed
    }, {
        new: true
    })
    res.redirect('/event');
});

module.exports = router;

