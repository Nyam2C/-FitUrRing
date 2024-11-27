const serverStartTime = Date.now();

const etcController = {
    getUptime: (req, res) => {
        res.json({ uptime: Math.floor((Date.now() - serverStartTime) / 1000) });
    }
};

module.exports = etcController;