const mongoose = require('mongoose')

const categroySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
  },
  color: {
    type: String
  }
})

module.exports = mongoose.model('Categories', categroySchema)