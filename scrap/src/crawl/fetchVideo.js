import { apiKey } from '../config/config.js';
import { maxIterations } from '../config/config.js';
import { ptToSeconds } from '../utils/convertTime.js';

//영상 시간을 가져오기 위한 함수
async function fetchVidLength(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();
        let video_length = data.items[0].contentDetails.duration;
        let video_likes = data.items[0].statistics.likeCount; // NaN인지 확인 후 처리
        video_likes = isNaN(Number(video_likes)) ? 0 : Number(video_likes);
        let channel_title = data.items[0].snippet.channelTitle;
        video_length = ptToSeconds(video_length);
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

export default async function fetchVideo(
    query,
    iteration,
    videoObject,
    pageToken = ''
) {
    if (iteration >= maxIterations) {
        return;
    }
    iteration++;

    try {
        const fetchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
        )}&type=video&maxResults=50&videoType=any&key=${apiKey}&pageToken=${pageToken}`;

        const response = await fetch(fetchUrl);
        const data = await response.json();

        // API 에러 응답 처리
        if (data.error) {
            console.error('YouTube API Error:', data.error.message);
            return;
        }

        // items가 없거나 비어있는 경우 처리
        if (!data.items || data.items.length === 0) {
            console.log('No items found for query:', query);
            return;
        }

        const results = await Promise.all(
            data.items.map(async item => {
                try {
                    let { videoLength, videoLikes, channelTitle } =
                        await fetchVidLength(item.id.videoId) || {};
                    
                    return {
                        video_id: item.id.videoId,
                        video_title: item.snippet.title,
                        video_description: item.snippet.description,
                        video_tag: query,
                        video_length: videoLength || 0,
                        video_likes: parseInt(videoLikes) || 0,
                        channel_title: channelTitle || '',
                    };
                } catch (err) {
                    console.error('Error processing video:', item.id.videoId, err);
                    return null;
                }
            })
        );

        // null 값 필터링
        const validResults = results.filter(result => result !== null);
        videoObject.push(...validResults);

        // 다음 페이지 처리
        if (data.nextPageToken) {
            // API 할당량 초과 방지를 위한 딜레이 추가
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchVideo(query, iteration, videoObject, data.nextPageToken);
        }
    } catch (err) {
        console.error('Error during API request:', err);
        // API 할당량 초과 시 잠시 대기
        if (err.message.includes('quota')) {
            console.log('API quota exceeded. Waiting before retry...');
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
}