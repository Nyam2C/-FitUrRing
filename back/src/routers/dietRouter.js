const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.authenticate(['user_id', 'user_name']), dietController.getDiet);
router.post('/', authMiddleware.authenticate(['user_id']), dietController.createDiet);
router.delete('/', authMiddleware.authenticate(['user_id']), dietController.deleteDiet);
router.get('/food', dietController.getFood);

module.exports = router;