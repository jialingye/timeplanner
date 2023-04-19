const express = require('express');
const mongoose = require('mongoose');
const router= express.Router();
const moment=require('moment-timezone');
const {API}=require('../config');


//import the model
const Event = require('../model/event');
const eventSeed=require('../db/eventSeed');

//create route
router.post('/',async(req,res)=>{
    req.body.completed=req.body.completed==="on"? true:false;
    const {eventTitle,eventType,date,startTime,endTime,completed,subtasks}=req.body;
   
    const start=(moment(`${date}${startTime}`,'YYYY-MM-DD hh:mm A')).toDate();
    const end=moment(`${date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();
    
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
    res.render ('type/search', {events});
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

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", API);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    try{
      const api=await fetch(`https://api.api-ninjas.com/v1/bucketlist`, requestOptions)
      const bucketlist = await api.json();
      const events=await Event.find(query);
      res.render ('type/date', {events, bucketlist});
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
// analyze
router.get('/analysis', async(req,res)=>{
  try{
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDay()-1);
    const startOfMonth= new Date(today.getFullYear(), today.getMonth(), 0);
   
    const sunday=new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDay());
    const firstDate= new Date(today.getFullYear(), today.getMonth(), 1);

    const weekly = await Event.find({
      date: {$gte: startOfWeek, $lte: today},
      completed: true
    })
    const monthly = await Event.find({
      date: {$gte: startOfMonth, $lte: today},
      completed: true
    })
    const daily = await Event.find({
      date: {$gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()-1), $lte: today},
      completed: true
    })
    const completedEvents = await Event.find({
      completed: true
    })

    let typeCount={};
    for( let event of completedEvents){
      const eventType = event.eventType 
      typeCount[eventType]=(typeCount[eventType]||0)+1;
    }
  
    let monthlyTypeCount={};
    for(let event of monthly){
      const eventType = event.eventType;
      monthlyTypeCount[eventType] = (monthlyTypeCount[eventType]|| 0) + 1;
    }

    let weeklyTypeCount={};
    for(let event of weekly){
      const eventType = event.eventType;
      weeklyTypeCount[eventType] = (weeklyTypeCount[eventType]|| 0) + 1;
    }

    let dailyTypeCount={};
    for(let event of daily){
      const eventType = event.eventType;
      dailyTypeCount[eventType] = (dailyTypeCount[eventType]|| 0) + 1;
    }

    res.render('type/analysis', {
      sunday: sunday,
      firstDate: firstDate,
      weekly: weekly.length,
      monthly: monthly.length,
      daily: daily.length,
      weeklyType: weeklyTypeCount,
      monthlyType: monthlyTypeCount,
      dailyType: dailyTypeCount,
      typeCount: typeCount,
      totalTasks: completedEvents.length
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
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

    const start=(moment(`${req.body.date}${startTime}`,'YYYY-MM-DD hh:mm A')).toDate();
    const end=moment(`${req.body.date}${endTime}`,'YYYY-MM-DD hh:mm A').toDate();
   
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
    res.redirect(`/event/${req.params.id}`);
});

module.exports = router;

