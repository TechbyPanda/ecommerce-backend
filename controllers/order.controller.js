const {Order} = require('../models/order.model');
const {OrderItem}=  require('../models/order-item.model')

exports.getOrderList = async function(req, res) {
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
  if(!orderList)
    res.status(500).json({success: false});
  res.send(orderList);
}

exports.getOrderByOrderId = async function(req, res) {
  const order = await Order.findById(req.params.id)
  .populate('user', 'name')
  .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}});
  if(!order)
    res.status(500).json({success: false});
  res.send(order);
}

exports.getOrderByUserId = async function(req, res) {
  const userOrderList = await Order.find({user: req.params.userId})
  .populate('user', 'name')
  .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
  .sort({'dateOrdered': -1});
  if(!userOrderList)
    res.status(500).json({success: false});
  res.send(userOrderList);
}

exports.addOrder = async (req, res) => {
  const orderItems = Promise.all(req.body.orderItems.map(async ({quantity, product}) => {
    let newOrderItem = new OrderItem({
      quantity: quantity,
      product: product
    });
    newOrderItem = await newOrderItem.save();

    return newOrderItem._id;
  }));

  const orderItemsResolved = await orderItems;
  
  const totalPrices = await Promise.all(orderItemsResolved.map(async (orderItemId) => {
    console.log(orderItemId)
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice;
  }))

  let order = new Order({
    orderItems: orderItemsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrices.reduce((acc, curr) => acc + curr, 0),
    user: req.body.user
  })

  order = await order.save()

  if(!order)
    return res.status(404).send('the order cannot be created!')

  res.status(200).send(order)
}

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {new: true}
  )

  if(!order)
    return res.status(400).json({status: false, message: 'Order not found!'})

  return res.status(200).send(order)
}

exports.deleteOrder = async(req, res) => {
  Order.findByIdAndRemove(req.params.id).then(async order => {
    if(order){
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem);
      })
      return res.status(200).json({success: true, message: 'The order is deleted!'})
    } else {
      return res.status(404).json({success: false, message: 'Order not found!'})
    }
  }).catch(err => {
    return res.status(400).json({sucess: false, error: err})
  })
}

exports.getTotalSales = async function (req, res) {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice'}}}
  ])

  if(!totalSales)
    return res.status(404).json({success: false, message: 'The order has no sales'});

  return res.status(200).json({success: true, totalSales: totalSales.pop().totalsales});
}

exports.getTotalOrders = async (req, res) => {
  const orderCount = await Order.countDocuments();
  
  if(!orderCount)
    res.status(500).json({success: false})
  res.send({userCount: orderCount})
}