//Dependencies
const express=require('express');
const mongoose = require('mongoose');
const app=express();
const {PORT,DATABASE_URL}=require('./config');
const methodOverride=require('method-override');

//middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(methodOverride("_method"))
app.set('view engine', 'ejs');

const Event = require('./model/event');
const eventSeed=require('./db/eventSeed');
//routes
app.get('/',(req,res)=>{
    res.send('default route')
})

const eventController = require('./controller/event')
app.use('/event',eventController);


app.get('/monthly', async(req,res)=>{
    const events= await Event.find({})
    const eventData= events.map((event)=>{
        return{
            title: event.eventTitle,
            start: event.startTime.toISOString(),
            end: event.endTime.toISOString(),
            allDay:false,
        }
    })
    console.log(eventData)
    const eventDataJson=JSON.stringify(eventData)
    res.render('calendar/monthly',{eventDataJson})
})
app.get('/weekly',(req,res)=>{
    res.render('calendar/weekly')
})
app.get('/daily',(req,res)=>{
    res.render('calendar/daily')
})

// app.get('/animal',(req,res)=>{
//     console.log(req.query)
//     const animalName=req.query.name
//     const myHeaders = new Headers();
// myHeaders.append("X-API-KEY", "KIlyRE5PHe+HSX18g4GVyg==QCQB3tR915WqBX5a");
// const requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
//   redirect: 'follow'
// };
// fetch(`https://api.api-ninjas.com/v1/animals?name=${animalName}`, requestOptions)
//   .then(response => response.json())
//   .then(result => res.json(result))
//   .catch(error => console.log('error', error));
// })


//listener
mongoose.connect(DATABASE_URL).then(
    ()=>{
        app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
    }
)