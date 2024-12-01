const express = require('express');
const router = express.Router();
const habittrackerController = require('../controllers/habittrackerController');

router.put('/goal', habittrackerController.setGoal);
router.get('/goal', habittrackerController.getGoal);
router.get('/records', habittrackerController.getEveryGoal);

module.exports = router;
