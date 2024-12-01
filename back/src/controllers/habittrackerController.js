router.put('/goal', habittrackerController.setGoal);
router.get('/goal', habittrackerController.getGoal);
router.get('/records', habittrackerController.getEveryGoal);

const express = require('express');
const router = express.Router();
const { minutesToSeconds, secondsToMinutes } = require('./etc/timeconvert');

//habittracker구조
const HabitTracker = require('./models/habittracker');
//goal_weight를 가져오기 위한
const User = require('./models/user');

const habittrackerController = {
    setGoal: async (req, res) => {
        const { goal_weekly, goal_daily, goal_daily_time } = req.body;
        //시간 변환
        const dailyTimeSeconds = minutesToSeconds(goal_daily_time);
        try {
            const newGoal = new HabitTracker({
                user_id: req.user_id, //미들웨어에서  설정한 user_id 가져온다
                goal_weekly,
                goal_daily,
                goal_daily_time: dailyTimeSeconds,
            });
            await newGoal.save();

            res.status(201).send('habitTracker goal is added');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to add habitTracker goal');
        }
    },
    getGoal: async (req, res) => {
        try {
            const goals = await HabitTracker.find({ user_id: req.user_id });
            const user = await User.findOne({ user_id: req.user_id }); // 미들웨어에서 설정한 user_id
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (goals.length === 0) {
                //만약 비어있다면 dummy data 반환
                const dummyGoal = [
                    {
                        goal_weekly: null,
                        goal_daily: [null, null, null, null, null, null, null],
                        goal_daily_time: null,
                        goal_weight: null,
                    },
                ];
                return res.status(200).json(dummyGoal);
            }

            const habitTrackergoal = goals.map(goal => {
                return {
                    goal_weekly: goal.goal_weekly,
                    goal_daily: goal.goal_daily,
                    goal_daily_time: goal.goal_daily_time,
                    goal_weight: user.user_goal_weights,
                };
            });

            res.status(200).json(habitTrackergoal);
        } catch (error) {
            res.status(500).json({
                message: 'Failed to get habitTracker goals',
                error: error.message,
            });
        }
    },
    getEveryGoal: async (req, res) => {
        try {
            //루틴에서 기록한 일일 기록들을 가져옴
        } catch (error) {
            res.status(500).json({
                message: 'Failed to get habitTracker monthly records',
                error: error.message,
            });
        }
    },
};
