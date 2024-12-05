const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/', videoController.getVideo);
router.get('/tag', videoController.filterVideo);

module.exports = router;
