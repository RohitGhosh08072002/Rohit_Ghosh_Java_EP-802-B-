const mongoose = require('mongoose')

function connect () {
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb://localhost/complaintapp',{useNewUrlParser: true, useUnifiedTopology: true})
}

module.exports = connect