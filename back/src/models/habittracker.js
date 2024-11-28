const mongoose = require('mongoose');

const habitTrackerSchema = new mongoose.Schema({
    habit_id: {
        type: String,
        required: true,
        unique: true
    },
    video_id: {
        type: String,
        required: true,
        ref: 'Video'
    },
    goal_weekly: {
        type: Number,
        min: 0
    },
    goal_daily: {
        type: Number,
        min: 0
    },
    goal_daily_time: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

const HabitTracker = mongoose.model('HabitTracker', habitTrackerSchema);

module.exports = { HabitTracker };