const router = require('express').Router();
const { addUser, getUser, getAllUser, updateUser, login } = require('../controllers/user.controller');

router.post('/', addUser);
router.get('/:id', getUser);
router.get('/', getAllUser)
router.put('/:id', updateUser);
router.post('/login', login);

module.exports = router