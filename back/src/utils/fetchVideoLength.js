const timeConvert = require('./utils/timeconvert');

async function fetchVidLength(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();
        let video_length = data.items[0].contentDetails.duration;
        let video_likes = data.items[0].statistics.likeCount;
        video_length = timeConvert.ptToSeconds(video_length);
        return { videoLength: video_length, videoLikes: video_likes };
    } catch (err) {
        console.error('Error during API details request;', err);
        return null;
    }
}

module.exports = fetchVidLength;
