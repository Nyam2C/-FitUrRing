import mongoose from 'mongoose';
import { dbURL } from '../config/config.js';

export async function connectDB() {
    try {
        await mongoose.connect(dbURL);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw new Error('MongoDB connection failed');
    }
}
