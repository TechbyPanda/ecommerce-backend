const router = require('express').Router();
const { addUser, getUser, getAllUser, updateUser, login, getCount } = require('../controllers/user.controller');
router.get('/count', getCount);
router.post('/', addUser);
router.get('/:id', getUser);
router.get('/', getAllUser)
router.put('/:id', updateUser);
router.post('/login', login);

module.exports = router