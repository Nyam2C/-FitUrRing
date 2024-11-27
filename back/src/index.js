const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

const initDB = require('./initDB');

const mongoUrl = `mongodb://wss-db:27017`;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

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

app.use('/api', etcRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Backend server is running on http://172.20.0.3:${port}`);
});