const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const habittrackerController = require('../controllers/habittrackerController');

router.put('/goal', habittrackerController.setGoal);
router.get('/goal', habittrackerController.getGoal);
router.get('/records', habittrackerController.getEveryGoal);

module.exports = router;
