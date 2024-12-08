const mongoose = require('mongoose');

const habitTrackerSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            ref: 'user',
        },
        goal_weekly: {
            //일주일에 몇 회 할건지
            type: Number,
            min: 0,
        },
        goal_daily: {
            //일주일 중 어떤 요일에 운동할건지 0, 1로 체크
            type: [Number],
            default: [0, 0, 0, 0, 0, 0, 0],
        },
        goal_daily_time: {
            // 00:00 형태로 입력받는데 seconds로 변환해서 DB에 들어갑니다
            type: Number,
            min: 0,
        },
        goal_weight: {
            //해빗트래커 페이지에서 받아온다
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const HabitTracker = mongoose.model('HabitTracker', habitTrackerSchema);

module.exports = HabitTracker;