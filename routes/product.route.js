const { createProduct, getAllProducts, getProduct, updateProduct, getFeaturedProduct, getCount, galleryImages } = require('../controllers/product.controller')
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null;
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}` )
    }
})
  
const uploadOptions = multer({ storage: storage })

const router = require('express').Router()
router.get('/featured/:count', getFeaturedProduct)
router.post('/',uploadOptions.single('image'), createProduct)
router.get('/get/count', getCount)
router.get('/',getAllProducts)
router.get('/:id',getProduct)
router.put('/:id',uploadOptions.single('image'), updateProduct)
router.put('/gallery-images/:id',uploadOptions.array('images', 5),galleryImages)

module.exports = router