const mongoose = require('mongoose');

const orderItemsSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Products'
  }
})

exports.OrderItem = mongoose.model('OrderItems', orderItemsSchema);