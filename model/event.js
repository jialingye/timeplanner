//import db connection
const mongoose=require('mongoose')
//import Schema (explaination)
const Schema = mongoose.Schema;

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
    eventSublist: {
        type: [String],
        default: []
      },
    repeat: {
        type: String,
        enum:['daily','weekly','monthly','yearly','none'],
        default:'none'
    },
    important:{
        type: Boolean,
        default: false
    }
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;