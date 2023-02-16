const { getOrderList, addOrder, getOrderByOrderId, updateOrderStatus, deleteOrder, getTotalSales, getTotalOrders, getOrderByUserId } = require('../controllers/order.controller');
const router= require('express').Router();

router.get('/', getOrderList);
router.post('/', addOrder);
router.get('/:id', getOrderByOrderId);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);
router.get('/get/totalsales', getTotalSales);
router.get('/get/totalorders', getTotalOrders);
router.get('/get/userorders/:userId', getOrderByUserId);

module.exports = router;