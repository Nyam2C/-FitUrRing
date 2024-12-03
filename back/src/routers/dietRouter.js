const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.authenticateToken(user_id, user_name), dietController.getDiet);
router.post('/', authMiddleware.authenticateToken, dietController.createDiet);
router.delete('/', authMiddleware.authenticateToken, dietController.deleteDiet);

module.exports = router;