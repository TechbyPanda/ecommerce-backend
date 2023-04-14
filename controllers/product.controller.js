const Category = require('../models/category.model')
const Product = require('../models/product.model')
const mongoose = require('mongoose')

exports.createProduct = async (req, res) => {
  const category = Category.findById(req.body.category)
  if(!category)
    return res.status(400).send('Invalid Category')

  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured
  })

  product = await product.save()

  if(!product)
    return res.status(500).send('The product cannot be created.')

  return res.status(200).send(product)
}

exports.getAllProducts = async (req, res) => {
  // const products = await Product.find().select('name image -_id')
  let filter = {}
  if(req.query.categories){
    filter = {category: req.query.categories.split(',')}
  }

  const products = await Product.find(filter).populate('category')

  if(!products)
    return res.status(500).json({success: false})

  res.send(products)
}

exports.getProduct = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) 
    return res.status(404).json({status: false, message: "Invalid Product id"})

  const product = await Product.findById(req.params.id).populate('category')

  if(!product)
    return res.status(500).json({success: false})
  res.send(product)
}

exports.updateProduct = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({status: false, message: "Invalid Product id"})
  const category = Category.findById(req.body.category)
  if(!category)
    return res.status(400).send('Invalid Category')

  const updateObject = {
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured
  };

  const file = req.file;
  console.log(req.hostname)

  if(file){
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    updateObject.image = `${basePath}${fileName}`;
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateObject,
    {new: true}
  )

  if(!product)
    return res.status(404).json({status: false, message: 'Product not found!'})

  return res.status(200).send(product)
}

exports.getFeaturedProduct = async (req, res) => {
  console.log(req.params.count)
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({isFeatured: true}).populate('category').limit(+count)

  if(!products)
    return res.status(500).json({success: false})

  res.send(products)
}

exports.getCount = async (req, res) => {
  const productCount = await Product.find().count()

  if(!productCount)
    res.status(500).json({success: false})
  res.send({productCount: productCount})
}

exports.galleryImages = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) 
    return res.status(404).json({status: false, message: "Invalid Product id"});

  const files = req.files;
  let imagePaths = [];
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  console.log(files);
  if(files){
    files.map(file => {
      imagePaths.push(`${basePath}${file.filename}`);
    })
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagePaths
    },
    {new: true}
  )

  if(!product)
    return res.status(404).json({status: false, message: 'Product not found!'})

  return res.status(200).send(product)
}

exports.deleteProduct = (req, res) => {
  Product.findByIdAndRemove(req.params.id).then(product => {
    if(product){
      return res.status(200).json({success: true, message: 'The product is deleted!'})
    } else {
      return res.status(404).json({success: false, message: 'Product not found!'})
    }
  }).catch(err => {
    return res.status(400).json({sucess: false, error: err})
  })
}