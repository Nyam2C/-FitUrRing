const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', userController.createUser);
router.post('/signin', userController.signIn);

router.post('/signout', authMiddleware.authenticate(['user_id']), userController.signOut);
router.get('/profile', authMiddleware.authenticate(['user_id', 'user_name', 'user_email', 'deviceInfo']), userController.getProfile);
router.patch('/edit', authMiddleware.authenticate([
    'user_id',
    'user_name',
    'user_email',
    'user_gender',
    'user_birth',
    'user_height',
    'user_weight',
    'user_created_at'
]), userController.updateProfile);
router.delete('/withdraw', authMiddleware.authenticate(['user_id', 'user_email', 'user_name', 'deviceInfo']), userController.deleteUser);

router.delete('/confirm-hard-delete', authMiddleware.authenticate(['user_id', 'user_name', 'user_email', 'type']), userController.confirmHardDelete);
router.post('/cancel-hard-delete', authMiddleware.authenticate(['user_id', 'user_name', 'user_email','type']), userController.cancelHardDelete);
router.get('/weight-history', authMiddleware.authenticate(['user_id']), userController.getWeightHistory);

module.exports = router;