const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const habittrackerController = require('../controllers/habittrackerController');

router.put(
    '/goal',
    authMiddleware.authenticate(['user_id', 'user_name']),
    habittrackerController.setGoal
);
router.get(
    '/goal',
    authMiddleware.authenticate(['user_id', 'user_name']),
    habittrackerController.getGoal
);
router.get(
    '/records',
    authMiddleware.authenticate(['user_id', 'user_name']),
    habittrackerController.getEveryRecords
);

module.exports = router;
