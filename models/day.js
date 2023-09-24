const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  date: String,  
  status: Number,
  createdDate: Date,
  updatedDate: Date,
  pictures: [{
    name: String, 
    status: Number
  }]
});

module.exports = mongoose.model('Day', daySchema);