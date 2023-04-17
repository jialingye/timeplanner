//Dependencies
const express=require('express');
const mongoose = require('mongoose');
const app=express();
const {PORT,DATABASE_URL,SECRET}=require('./config');
const methodOverride=require('method-override');
const session = require('express-session')
const MongoStore = require('connect-mongo')

//middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: DATABASE_URL
        }),
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30
        }
    })
)


//db
const Event = require('./model/event');
const eventSeed=require('./db/eventSeed');


//routes
const eventController = require('./controller/event')
app.use('/event',eventController);

const userController = require('./controller/users')
app.use('/user',userController);

//app.get
app.get('/',(req,res)=>{
    res.render('users/entrance')
})

app.get('/monthly', async(req,res)=>{
    const events= await Event.find({})
    const eventData= events.map((event)=>{
        return{
            title: event.eventTitle,
            start: event.startTime.toISOString(),
            end: event.endTime.toISOString(),
            url: `event/${event._id}`,
            allDay:false,
            classNames: `${event.eventType} ${event.completed ? "completed": ""}`
        }
    })
    const eventDataJson=JSON.stringify(eventData)
    res.render('calendar/monthly',{eventDataJson})
})
app.get('/weekly',async(req,res)=>{
    const events= await Event.find({})
    const eventData= events.map((event)=>{
        return{
            title: event.eventTitle,
            start: event.startTime.toISOString(),
            end: event.endTime.toISOString(),
            url: `event/${event._id}`,
            allDay:false,
            classNames: `${event.eventType} ${event.completed ? "completed": ""}`
        }
    })
    const eventDataJson=JSON.stringify(eventData)
    res.render('calendar/weekly', {eventDataJson})
})
app.get('/daily',async(req,res)=>{
    const events= await Event.find({})
    const eventData= events.map((event)=>{
        return{
            title: event.eventTitle,
            start: event.startTime.toISOString(),
            end: event.endTime.toISOString(),
            url: `event/${event._id}`,
            allDay:false,
            classNames: `${event.eventType} ${event.completed ? "completed": ""}`
        }
    })
    const eventDataJson=JSON.stringify(eventData)
    res.render('calendar/daily',{eventDataJson})
})

//listener
mongoose.connect(DATABASE_URL).then(
    ()=>{
        app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
    }
)