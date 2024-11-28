const express = require('express');
const router = express.Router();
const etcController = require('../controllers/etcController');

router.get('/uptime', etcController.getUptime);

module.exports = router;