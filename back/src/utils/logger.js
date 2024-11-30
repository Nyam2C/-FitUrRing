const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const toKST=(date) => new Date(date.getTime() + (9*60*60*1000));

const logFormat=winston.format.printf(({ level, message }) => {
    if(typeof message === 'object' && message.timestamp) message.timestamp=toKST(new Date(message.timestamp)).toLocaleString();
    return `[${toKST(new Date()).toLocaleString()}] ${level}: ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
});

const logger=winston.createLogger({
    format: winston.format.combine(
        logFormat
    ),
    transports: [
        // 콘솔 출력
        // new winston.transports.Console({
        //     format: winston.format.combine(
        //         winston.format.colorize(),
        //         logFormat
        //     )
        // }),

        // 일별 로그 파일 생성
        new DailyRotateFile({
            level: 'info',
            dirname: path.join(__dirname, '../logs'),
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),
        // 경고 로그 (warn)
        new DailyRotateFile({
            level: 'warn',
            dirname: path.join(__dirname, '../logs'),
            filename: 'warn-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),
        // 에러 로그 (error)
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

module.exports = logger;