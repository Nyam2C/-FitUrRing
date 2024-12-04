require('dotenv').config();
const ptToSeconds = require('./utils/timeconvert');

async function fetchVidLength(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        let video_length = data.items[0].contentDetails.duration;
        let video_likes = data.items[0].statistics.likeCount;
        video_length = ptToSeconds(video_length);
        let channel_title = data.items[0].snippet.channelTitle;
        return {
            videoLength: video_length,
            videoLikes: video_likes,
            channelTitle: channel_title,
        };
    } catch (err) {
        console.error('Error during API details request;', err);
        return null;
    }
}

module.exports = fetchVidLength;
