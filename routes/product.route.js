const { createProduct, getAllProducts, getProduct, updateProduct, getFeaturedProduct, getCount } = require('../controllers/product.controller')

const router = require('express').Router()
router.get('/featured/:count', getFeaturedProduct)
router.post('/',createProduct)
router.get('/get/count', getCount)
router.get('/',getAllProducts)
router.get('/:id',getProduct)
router.put('/:id',updateProduct)

module.exports = router