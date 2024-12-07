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

// API 키를 사용하여 유튜브 API에 검색 요청 보내기
export default async function fetchVideo(
    query,
    iteration,
    videoObject,
    pageToken = ''
) {
    //한번에 50개씩 2번(maxiteration만큼) 반복 (키워드 당 100개씩)
    const fetchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
    )}
    &type=video&maxResults=50&videoType=any&key=${apiKey}&pageToken=${pageToken}`;

    if (iteration >= maxIterations) {
        return;
    }
    iteration++;

    try {
        const response = await fetch(fetchUrl);
        const data = await response.json();

        const results = await Promise.all(
            data.items.map(async item => {
                let { videoLength, videoLikes, channelTitle } =
                    await fetchVidLength(item.id.videoId);
                return {
                    video_id: item.id.videoId,
                    video_title: item.snippet.title,
                    video_description: item.snippet.description,
                    video_tag: query, // 검색 키워드가 들어가게 된다.
                    video_length: videoLength, //videoLength 값 사용
                    video_likes: parseInt(videoLikes),
                    channel_title: channelTitle,
                };
            })
        );
        /*console.log('Results:', results);*/
        videoObject.push(...results); //video_object에 추가

        //페이지 토큰 설정
        let nextPageToken = data.nextPageToken;

        //다음페이지 진행
        if (nextPageToken) {
            await fetchVideo(query, iteration, videoObject, nextPageToken);
        }
    } catch (err) {
        console.error('Error during API request:', err);
    }
}
