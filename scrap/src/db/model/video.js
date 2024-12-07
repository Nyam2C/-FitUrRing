import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    video_id: {
        type: String,
        required: true,
        unique: true,
    },
    video_title: {
        type: String,
        required: true,
    },
    video_description: {
        type: String,
    },
    video_tag: {
        type: String,
        required: true,
    },
    video_length: {
        type: Number,
    },
    video_likes: {
        type: Number,
        default: 0,
    },
    channel_title: {
        type: String,
    },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
