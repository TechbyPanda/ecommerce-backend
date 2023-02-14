const Category = require('../models/category.model')
const router = require('../routes/category.route')
const mongoose = require('mongoose')

exports.addCategory = async (req, res) => {
  console.log(req.body)
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })

  category = await category.save()

  if(!category)
    return res.status(404).send('the category cannot be created!')

  res.status(200).send(category)
}

exports.deleteCategory = async(req, res) => {
  Category.findByIdAndRemove(req.params.id).then(category => {
    if(category){
      return res.status(200).json({success: true, message: 'The category is deleted!'})
    } else {
      return res.status(404).json({success: false, message: 'Category not found!'})
    }
  }).catch(err => {
    return res.status(400).json({sucess: false, error: err})
  })
}

exports.getCategories = async (req, res) => {  const categoryList = await Category.find()

  if(!categoryList)
    return res.status(500).json({success: false})

  return res.status(200).send(categoryList)
}

exports.getCategory = async(req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({status: false, message: "Invalid Category id"})
  const category = await Category.findById(req.params.id)

  if(!category){
    return res.status(500).json({message: 'The category with given id was not found!'})
  }

  return res.status(200).send(category)
}

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color
    },
    {new: true}
  )

  if(!category)
    return res.status(404).json({status: false, message: 'Category not found!'})

  return res.status(200).send(category)
}