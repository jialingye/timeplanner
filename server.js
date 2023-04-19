//Dependencies
const express=require('express');
const mongoose = require('mongoose');
const app=express();
const {PORT,DATABASE_URL,SECRET,API2}=require('./config');
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

// app.get('/*',(req,res) => {
//     res.send('Error')
// })

app.get('/ai', async(req,res)=>{
    // const question = req.query.question;
    // console.log(question)
    // const query={};
    // if(question){
    //   query.question = question;
    // }

    // const url = 'https://simple-chatgpt-api.p.rapidapi.com/ask';

    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //     'X-RapidAPI-Key': API2,
    //     'X-RapidAPI-Host': 'simple-chatgpt-api.p.rapidapi.com'
    //   },
    //   body: JSON.stringify({"question":question})
    // };
    // try{
    //     const ai=await fetch(url,options)
    //     const chatgpt=await ai.json();
    //     console.log(chatgpt)
    //     res.render('type/chatgpt', {chatgpt})
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).send('server error')
    // }
    const chatgpt={
        answer: "1. Understand JavaScript fundamentals: Before learning Node.js, it's crucial to have a solid grasp of JavaScript basics, including variables, data types, loops, and conditional statements. This will form the foundation for learning more complex concepts in Node.js.\n" +
          '\n' +
          '2. Set up a development environment: To learn Node.js, you need to have a development environment set up on your computer. This includes installing Node.js, a code editor, and other tools that will make your learning process smoother.\n' +
          '\n' +
          '3. Learn Node.js core concepts: Once you have a basic understanding of JavaScript and have set up your environment, you can start learning the core concepts of Node.js. This includes learning about modules, file systems, events, streams, and callbacks.\n' +
          '\n' +
          '4. Build projects: Learning by doing is one of the best ways to learn Node.js. Start by building small projects such as a web server, command-line application, or a chat application. As you gain more experience, you can move on to building more complex projects.\n' +
          '\n' +
          '5. Engage with the Node.js community: The Node.js community is vast and active. Engaging with the community through forums, social media, or attending meetups can help you learn from other developers, get feedback on your projects, and stay up to date with the latest trends and best practices.'
      }
      res.render('type/chatgpt', {chatgpt}) 
})

//listener
mongoose.connect(DATABASE_URL).then(
    ()=>{
        app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
    }
)