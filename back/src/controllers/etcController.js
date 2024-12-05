const path = require('path');

const etcController = {
    getUptime: (req, res) => {
        const uptime = process.uptime();
        res.json({ uptime });
    },

    handleConfirmDelete: (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/confirm-delete.html'));
    },

    handleCancelDelete: (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/cancel-delete.html'));
    }
};

module.exports = etcController;