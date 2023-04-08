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

// const Event = require('./model/event');
// const eventSeed=require('./db/eventSeed');
app.get('/',(req,res)=>{
    res.send('default route')
})

const eventController = require('./controller/event')
app.use('/event',eventController);

// app.get('/event', async(req,res) =>{
//     const events= await Event.find({})
//     res.render('index',{events})
// })

// app.get('/event/seed', async (req, res) => {
//     try {
//       // Delete all existing events
//       await Event.deleteMany({});
  
//       // Seed the database with the example events
//       await Event.create(eventSeed);
  
//       // Redirect to the events index page
//       res.redirect('/event');
//     } catch (err) {
//       console.error(err);
//       res.send('Error message: ' + err);
//     }
//   });

app.get('/monthly',(req,res)=>{
    res.render('monthly')
})
app.get('/weekly',(req,res)=>{
    res.render('weekly')
})
app.get('/daily',(req,res)=>{
    res.render('daily')
})
app.get('/animal',(req,res)=>{
    console.log(req.query)
    const animalName=req.query.name
    const myHeaders = new Headers();
myHeaders.append("X-API-KEY", "KIlyRE5PHe+HSX18g4GVyg==QCQB3tR915WqBX5a");
const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
fetch(`https://api.api-ninjas.com/v1/animals?name=${animalName}`, requestOptions)
  .then(response => response.json())
  .then(result => res.json(result))
  .catch(error => console.log('error', error));
})
//listener
mongoose.connect(DATABASE_URL).then(
    ()=>{
        app.listen(PORT, () => console.log(`express is listening on port: ${PORT}`));
    }
)