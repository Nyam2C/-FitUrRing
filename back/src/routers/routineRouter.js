const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const routineController = require('../controllers/routineController');

router.post('/records', routineController.recordRoutine);
router.get('/', routineController.getRoutine);
router.get('/videos', routineController.getRoutineExercise);
router.post('/', routineController.createRoutine);
router.delete('/', routineController.deleteRoutine);
router.put('/add', routineController.addRoutine);
router.delete('/delete', routineController.deleteRoutineComponent);

module.exports = router;
