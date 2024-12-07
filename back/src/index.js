const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const initDB = require('./initDB');
const { logRequest } = require('./utils/logger');

const app = express();
const port = 8080;

const cors = require('cors');
app.use(cors({
    origin: `https://${process.env.SERVER_NAME}`,
    credentials: true
}));

app.use(express.static(path.join(__dirname, '../public')));

const mongoUrl = `mongodb://wss-db:27017`;
mongoose.connect(mongoUrl);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('trust proxy', true);

app.disable('x-powered-by');

app.use('/api', (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => logRequest(req, res, startTime));
    next();
});

app.use(authMiddleware.requestLogger, authMiddleware.securityHeaders, authMiddleware.apiLimiter);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    try {
        await initDB();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});

const userRouter = require('./routers/userRouter');
const etcRouter = require('./routers/etcRouter');
const videoRouter = require('./routers/videoRouter');
const habitRouter = require('./routers/habittrackerRouter');
const routineRouter = require('./routers/routineRouter');
const dietRouter = require('./routers/dietRouter');

app.use('/api/user', userRouter);
app.use('/api/video', videoRouter);
app.use('/api/habitTracker', habitRouter);
app.use('/api/routine', routineRouter);
app.use('/api/diet', dietRouter);
app.use('/api', etcRouter);

app.listen(port, () => {
    console.log(`Backend server is running on http://172.20.0.3:${port}`);
});
