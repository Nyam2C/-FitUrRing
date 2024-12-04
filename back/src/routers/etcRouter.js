const express = require('express');
const router = express.Router();
const path = require('path');
const etcController = require('../controllers/etcController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/uptime', etcController.getUptime);

router.get('/confirm-delete', 
    authMiddleware.authenticate(['user_id', 'type']), 
    etcController.handleConfirmDelete
);
router.get('/cancel-delete', 
    authMiddleware.authenticate(['user_id', 'type']), 
    etcController.handleCancelDelete
);

// 인증 실패시 처리를 위한 에러 핸들러
router.use((err, req, res, next) => {
    if (err.status === 401) {
        res.type('html');
        return res.sendFile(path.join(__dirname, '../../public/unknown-delete.html'));
    }
    next(err);
});

module.exports = router;