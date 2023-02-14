const router = require('express').Router()
const controller = require('../controllers/category.controller')

router.post('/', controller.addCategory)
router.delete('/:id',controller.deleteCategory)
router.get('/',controller.getCategories)
router.get('/:id', controller.getCategory)
router.put('/:id', controller.updateCategory)

module.exports = router