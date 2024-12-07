const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    date: {
        // 0000-00-00 형태
        type: String,
    },
    video_id: {
        //video 모델 참조가 아니므로, 시간도 따로 측정
        type: String,
        required: true,
    },
    video_title: {
        type: String,
    },
    video_tag: {
        type: String,
        require: true,
    },
    video_time: {
        type: String,
        required: true,
    },
});

const Record = mongoose.model('Record', recordSchema);

module.exports = { Record };
