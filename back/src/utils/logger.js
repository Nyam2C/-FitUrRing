const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const toKST = (date) => new Date(date.getTime() + (9*60*60*1000));

const logFormat = winston.format.printf(({ level, message }) => {
    if(typeof message === 'object' && message.timestamp) message.timestamp = toKST(new Date(message.timestamp)).toLocaleString();
    return `[${toKST(new Date()).toLocaleString()}] ${level}: ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(logFormat),
    transports: [
        new DailyRotateFile({
            level: 'info',
            dirname: path.join(__dirname, '../logs'),
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),
        new DailyRotateFile({
            level: 'warn',
            dirname: path.join(__dirname, '../logs'),
            filename: 'warn-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),
        new DailyRotateFile({
            level: 'error',
            dirname: path.join(__dirname, '../logs'),
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        })
    ]
});

const logRequest = (req, res, startTime) => {
    const responseTime = Date.now() - startTime;
    const filteredHeaders = { ...req.headers };
    delete filteredHeaders.authorization;
    delete filteredHeaders.cookie;

    const logData = {
        timestamp: new Date(),
        headers: filteredHeaders,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userId: req.user?.user_id || 'anonymous',
        method: req.method,
        path: req.path,
        ips: req.ips.length ? req.ips : [req.ip],
        body: req.method !== 'GET' ? req.body : undefined
    };

    if (res.statusCode >= 400) {
        logger.error(logData);
    } else {
        logger.info(logData);
    }
};

module.exports = { logger, logRequest };