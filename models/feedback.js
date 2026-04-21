const mongoose = require('mongoose')
const dbconnect = require('../db')

//Call the db to connect the mongo db
dbconnect()

// Feedback Schema
const FeedbackSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String
    }
});

const Feedback = module.exports = mongoose.model('Feedback', FeedbackSchema);

module.exports.submitFeedback = function (newFeedback, callback) {
    newFeedback.save(callback);
}

module.exports.getAllFeedbacks = function(callback){
    Feedback.find(callback);
}
