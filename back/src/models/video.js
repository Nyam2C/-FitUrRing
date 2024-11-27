const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    video_id: {
        type: String,
        required: true,
        unique: true
    },
    video_title: {
        type: String,
        required: true
    },
    video_description: {
        type: String
    },
    video_tag: {
        type: String
    },
    video_url: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };