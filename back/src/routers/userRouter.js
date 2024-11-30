const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', userController.createUser);
router.post('/signin', userController.signIn);
router.post('/refresh', authMiddleware.refreshToken);

router.post('/signout', authMiddleware.authenticate, userController.signOut);
router.delete('/withdraw', authMiddleware.authenticate, userController.deleteUser);
router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.patch('/edit', authMiddleware.authenticate, userController.updateProfile);

module.exports = router;