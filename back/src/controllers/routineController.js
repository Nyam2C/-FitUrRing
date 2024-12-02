const express = require('express');
const router = express.Router();
const minutesToSeconds = require('./etc/timeconvert');

//운동 영상 구조
const Video = require('./models/video');
//루틴 구조
const Routine = require('./models/routine');
// 기록할 DB 구조
const Record = require('./models/records');

router.get('/', routineController.getRoutine);
router.get('/videos', routineController.getRoutineExercise);
router.post('/', routineController.createRoutine);
router.post('/add', routineController.addRoutine);

const routineController = {
    recordRoutine: async (req, res) => {
        const { date, video_id, video_time, video_tag } = req.body;
        try {
            const newRecord = new Routine({
                user_id: req.user_id, //미들웨어에서 받아온 user_id
                date,
                video_id,
                video_tag,
                video_time: minutesToSeconds(video_time),
            });
            await newRecord.save();
            res.status(201).send('Routine records added');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to add workout records');
        }
    },
    getRoutine: async (req, res) => {
        try {
            const userRoutine = await Routine.find({
                user_id: req.user_id,
            }).populate('routine_exercises.video');
            if (userRoutine.length === 0) {
                // 아무런 루틴도 없다면 null 로 채워진 루틴 하나를 return
                const dummyRoutine = [
                    {
                        routine_id: null,
                        routine_name: null,
                        routine_exercises: [
                            {
                                video: {
                                    video_id: null,
                                    video_time: null,
                                    video_tag: null,
                                },
                            },
                        ],
                    },
                ];
                return res.json(dummyRoutine);
            }
            return res.status(200).json(userRoutine);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to get user routine',
                error: error.message,
            });
        }
    },
    getRoutineExercise: async (req, res) => {
        const { routine_name } = req.body;
        try {
            const routine = await Routine.findOne({ routine_name }).populate(
                'routine_exercises.video'
            );

            if (!routine) {
                return res.status(404).json({ message: 'Routine not Found' });
            }

            res.status(200).json(routine.routine_exercises);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to get routine exercise',
                error: error.message,
            });
        }
    },
    createRoutine: async (req, res) => {
        const { routine_name } = req.body;
        try {
            const newRoutine = new Routine({
                user_id: req.user_id,
                routine_name,
            });
            await newRoutine.save();
            res.status(201).send('new routine folder was created');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to add new routine folder');
        }
    },
    deleteRoutine: async (req, res) => {
        const { routine_name } = req.body;
        try {
            const deletedRoutine = await Routine.findOneAndDelete({
                user_id: req.user_id, //미들웨어에서 가져온 user_id
                routine_name,
            });
            // 성공적으로 삭제되었을 때
            res.status(200).json({ message: 'Routine deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to delete routine',
                error: error.message,
            });
        }
    },
    addRoutine: async (req, res) => {
        const { routine_name, video_id } = req.body;
        try {
            const selectedVideo = await Video.findOne({ video_id: video_id });
            if (!selectedVideo) {
                return res
                    .status(404)
                    .json({ message: 'Workout Video is not found' });
            }
            //이걸 matchRoutine의 routine_Exercise로 추가해야함

            const updatedRoutine = await Routine.findOneAndUpdate(
                { user_id: req.user_id, routine_name },
                { $push: { routine_exercises: { video: selectedVideo._id } } },
                { new: true }
            );
            res.status(201).json(updatedRoutine);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to add routine videos to Routine',
                error: error.message,
            });
        }
    },
    deleteRoutineComponent: async (req, res) => {
        const { routine_name, video_id } = req.body;
        try {
            const videoContent = await Video.findOne({ video_id });
            if (!videoContent) {
                return res.status(404).json({
                    message: 'Workout Video not found',
                });
            }

            const deletedRoutineComponent = await Routine.updateMany(
                { user_id: req.user_id },
                { $pull: { routine_exercises: { video: videoContent._id } } },
                { new: true }
            );
            res.status(200).json(updatedRoutine);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to delete video from routines',
                error: error.message,
            });
        }
    },
};
