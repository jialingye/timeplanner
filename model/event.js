//import db connection
const mongoose=require('mongoose')
//import Schema (explaination)
const Schema = mongoose.Schema;

// const subtaskSchema= new Schema({
//   subtask: String
// })


//create a todo schema
const eventSchema = new Schema({
    date: {
        type: Date,
        required: true
      },
    startTime: {
        type: Date,
        required: true
      },
    endTime: {
        type: Date,
        required: true
      },
    eventType: {
        type: String,
        required: true
      },
    eventTitle: {
        type: String,
        default: ""
      },
    subtasks:{
      type: String,
      default: ""
    },
    completed:{
        type: Boolean,
        default: false
    }
})

const Event = mongoose.model('Event', eventSchema, "event");

module.exports = Event;