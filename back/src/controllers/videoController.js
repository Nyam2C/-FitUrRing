const express = require('express');
const router = express.Router();
const minutesToSeconds = require('../utils/timeconvert');

//운동 영상 구조
const Video = require('../models/video');

const videoController = {
    getVideo: async (req, res) => {
        try {
            const video_per_page = parseInt(req.query.video_per_page) || 10;
            const last_id = req.query.last_id;

            //전체 데이터 수
            const totalVideos = await Video.countDocuments();

            // last_id 기반 쿼리 조건 설정
            const query = last_id ? { _id: { $gt: last_id } } : {};

            //해당 페이지(오름차순)
            const videos = await Video.find(query)
                .sort({ _id: 1 })
                .limit(video_per_page);

            res.json({
                video_per_page,
                videos,
                last_id:
                    videos.length > 0 ? videos[videos.length - 1]._id : null, //다음페이지 여부
            });
        } catch (error) {
            res.status(500).json({
                message: 'failed to retrieve Workout videos',
                error: error.message,
            });
        }
    },
    filterVideo: async (req, res) => {
        try {
            const tags = req.query.video_tag;
            const video_tag = tags ? tags.split(' ') : []; //video_tag 배열처리

            //시간 undefined 방지를 위한 기본값 설정
            let video_min_time = minutesToSeconds('00:00');
            let video_max_time = minutesToSeconds('1440:00');

            //00:00 입력에 대한 기본값 설정
            if (
                req.query.video_time_from === '00:00' &&
                req.query.video_time_to === '00:00'
            ) {
                video_min_time = minutesToSeconds('00:00');
                video_max_time = minutesToSeconds('1440:00');
            } else if (req.query.video_time_from && req.query.video_time_to) {
                video_min_time = minutesToSeconds(req.query.video_time_from);
                video_max_time = minutesToSeconds(req.query.video_time_to);
            }

            const video_level = req.query.video_level;
            const video_per_page = parseInt(req.query.video_per_page) || 10;
            const last_id = req.query.last_id; //커서페이징

            const filter = {
                video_length: { $gte: video_min_time, $lte: video_max_time },
            };

            // video_tag가 존재하면 필터에 추가
            if (video_tag && Array.isArray(video_tag)) {
                const tagregex = video_tag.map(tag => `(${tag})`).join('|');

                // video_tag가 존재하고 Advanced가 존재하는 경우
                if (video_level) {
                    filter.video_tag = {
                        $regex: `(?=.*advanced)(?=.*(${tagregex}))`,
                        $options: 'i',
                    };
                } else {
                    filter.video_tag = {
                        $regex: `(?=.*(${tagregex}))`,
                        $options: 'i',
                    };
                }
            } else {
                // advanced 만 존재할 때
                if (video_level) {
                    filter.video_tag = {
                        $regex: `(?=.*advanced)`,
                        $options: `i`,
                    };
                }
            }

            const totalVideos = await Video.find(filter).countDocuments(); //filter된 영상 수

            if (last_id) {
                //페이징 여부에 따른 조건 추가
                filter._id = { $gt: last_id };
            }

            const videos = await Video.find(filter)
                .sort({ _id: 1 })
                .limit(video_per_page);

            res.json({
                totalVideos,
                videos,
                last_id: videos.length ? videos[videos.length - 1]._id : null,
            });
        } catch (error) {
            console.error('tag error', error);
            res.status(500).json({
                message: 'failed to retrieve filtered workout videos',
                error: error.message,
            });
        }
    },
};

module.exports = videoController;
