const express = require('express');
const router = express.Router();
const { minutesToSeconds, secondsToMinutes } = require('../utils/timeconvert');

//habittracker구조
const HabitTracker = require('../models/habittracker');
//goal_weight는 habit tracker schema 안에 존재하도록

const habittrackerController = {
    setGoal: async (req, res) => {
        const { goal_weekly, goal_daily, goal_daily_time, goal_weight } =
            req.body;
        //시간 변환
        const dailyTimeSeconds = minutesToSeconds(goal_daily_time);
        try {
            const newGoal = new HabitTracker({
                user_id: req.user.user_id, //미들웨어에서  설정한 user_id 가져온다
                goal_weekly,
                goal_daily,
                goal_daily_time: dailyTimeSeconds,
                goal_weight,
            });
            await newGoal.save();

            res.status(201).json(newGoal);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'failed to add goal',
                error: error.message,
            });
        }
    },
    getGoal: async (req, res) => {
        try {
            const goals = await HabitTracker.find({
                user_id: req.user.user_id,
            });
            if (goals.length === 0) {
                //만약 비어있다면 dummy data 반환
                const dummyGoal = [
                    {
                        user_id: req.user.user_id,
                        goal_weekly: null,
                        goal_daily: [
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                        ],
                        goal_daily_time: '00:00',
                        goal_weight: null,
                    },
                ];
                return res.status(200).json(dummyGoal);
            }

            const habitTrackergoal = goals.map(goal => {
                return {
                    user_id: req.user.user_id,
                    goal_weekly: goal.goal_weekly,
                    goal_daily: goal.goal_daily,
                    goal_daily_time: secondsToMinutes(goal.goal_daily_time),
                    goal_weight: goal.goal_weight,
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
    getEveryRecords: async (req, res) => {
        const { period } = req.query.period;
        try {
            //정규식
            const regex = new RegExp(`^${period}`);

            //해당 월에 해당하는 운동 기록들을 가져옴
            const monthlyRecords = Record.find({
                user_id: req.user.user_id, //미들웨어에 있는 user_id
                date: { $regex: regex },
            });
            res.status(200).json(monthlyRecords);
        } catch (error) {
            res.status(500).json({
                message: 'Failed to get habitTracker monthly records',
                error: error.message,
            });
        }
    },
};
