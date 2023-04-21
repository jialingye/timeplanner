//Dependencies
const express=require('express');
const mongoose = require('mongoose');
const app=express();
const {PORT,DATABASE_URL,SECRET,API2}=require('./config');
const methodOverride=require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fetch = require('node-fetch')

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


//routes
const eventController = require('./controller/event')
app.use('/event',eventController);

const userController = require('./controller/users')
app.use('/user',userController);

//app.get
app.get('/',(req,res)=>{
    res.render('users/entrance')
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


// app.get('/*',(req,res) => {
//     res.send('Error')
// })

app.get('/ai', async(req,res)=>{
    const question = req.query.question;
    console.log(question)
    const query={};
    if(question){
      query.question = question;
    }

    const url = 'https://simple-chatgpt-api.p.rapidapi.com/ask';

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'a9eecca6f1amsh38e81f292aea512p1fd5e9jsn7ca6fd0c67c5',
        'X-RapidAPI-Host': 'simple-chatgpt-api.p.rapidapi.com'
      },
      body: JSON.stringify({"question":question})
    };
    try{
        const ai=await fetch(url,options)
        const chatgpt=await ai.json();
        res.render('type/chatgpt', {chatgpt})
    } catch (err) {
        console.log(err);
        res.status(500).send('server error')
    }
})

//listener
mongoose.connect(DATABASE_URL).then(
    ()=>{
        app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
    }
)