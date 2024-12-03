const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const routineController = require('../controllers/routineController');

router.post(
    '/records',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.recordRoutine
);
router.get(
    '/',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.getRoutine
);
router.get(
    '/videos',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.getRoutineExercise
);
router.post(
    '/',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.createRoutine
);
router.delete(
    '/',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.deleteRoutine
);
router.put(
    '/add',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.addRoutine
);
router.delete(
    '/delete',
    authMiddleware.authenticate(['user_id', 'user_name']),
    routineController.deleteRoutineComponent
);

module.exports = router;
