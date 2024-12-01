const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.post('/signin', userController.signIn);
router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateById);
router.delete('/:id', userController.deleteById);

module.exports = router;
