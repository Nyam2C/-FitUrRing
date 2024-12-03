const express = require('express');
const router = express.Router();
const minutesToSeconds = require('../utils/timeconvert');

//운동 영상 구조
const Video = require('../models/video');

const videoController = {
    getVideo: async (req, res) => {
        try {
            const page = parseInt(req.query.page);
            const video_per_page = parseInt(req.query.video_per_page);
            const skipCount = (page - 1) * video_per_page;

            //전체 데이터 수
            const totalVideos = await Video.countDocuments();

            //해당 페이지
            const videos = await Video.find()
                .skip(skipCount)
                .limit(video_per_page);

            res.json({
                page,
                video_per_page,
                totalVideos,
                totalPages: Math.ceil(totalVideos / video_per_page),
                videos,
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
            const video_min_time = minutesToSeconds(req.query.video_time_from);
            const video_max_time = minutesToSeconds(req.query.video_time_to);
            const video_level = req.query.video_level;

            const filter = {
                video_length: { $gte: video_min_time, $lte: video_max_time },
            };

            // video_tag가 존재하면 필터에 추가
            if (video_tag && Array.isArray(video_tag)) {
                filter.video_tag = {
                    $regex: video_tag.map(tag => `(${tag})`).join('|'), // 모든 태그가 포함되는 정규식 생성
                    $options: 'i', // 대소문자 구분 없음
                };
            }

            // Advanced 수준 필터 추가
            if (video_level && video_level.toLowerCase() === 'advanced') {
                filter.video_tag = filter.video_tag || [];
                filter.video_tag.$regex = `Advanced|${
                    filter.video_tag.$regex || ''
                }`;
            }
            const videos = await Video.find(filter);
            res.json(videos);
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
