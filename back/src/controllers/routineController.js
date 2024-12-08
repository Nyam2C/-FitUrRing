const minutesToSeconds = require('../utils/timeconvert');
const Routine = require('../models/routine');
const Video = require('../models/video');

const routineController = {
    recordRoutine: async (req, res) => {
        const { date, video_id, video_time, video_tag } = req.body;
        try {
            const newRecord = new Routine({
                user_id: req.user.user_id, //미들웨어에서 받아온 user_id
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
                user_id: req.user.user_id
            }).populate('routine_exercises.video').exec();

            if (userRoutine.length === 0) {
                const dummyRoutine = [{
                    routine_id: null,
                    routine_name: null,
                    routine_exercises: [{
                        video: {
                            video_id: null,
                            video_time: null,
                            video_tag: null,
                        },
                    }],
                }];
                return res.json(dummyRoutine);
            }

            return res.status(200).json(userRoutine);
        } catch (error) {
            console.error('Routine Error:', error);
            res.status(500).json({
                message: 'Failed to get user routine',
                error: error.message
            });
        }
    },
    getRoutineExercise: async (req, res) => {
        const { routine_name } = req.body;
        try {
            const routine = await Routine.findOne({
                user_id: req.user.user_id,
                routine_name,
            }).populate('routine_exercises.video');

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
                user_id: req.user.user_id,
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
                user_id: req.user.user_id, //미들웨어에서 가져온 user_id
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
                { user_id: req.user.user_id, routine_name },
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
                { user_id: req.user.user_id },
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
    getRoutineVideos: async (req, res) => {
        const routine_name = req.query.routine_name;  // GET 요청의 쿼리 파라미터
        try {
            const routine = await Routine.findOne({
                user_id: req.user.user_id,
                routine_name,
            }).populate('routine_exercises.video');

            if (!routine) {
                return res.status(404).json({ message: 'Routine not Found' });
            }

            // video 정보만 추출하여 반환
            const videos = routine.routine_exercises
                .map(exercise => exercise.video)
                .filter(video => video); // null/undefined 필터링

            res.status(200).json(videos);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Failed to get routine videos',
                error: error.message,
            });
        }
    },
};

module.exports = routineController;