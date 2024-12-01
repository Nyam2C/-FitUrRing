const { addVideoInfo } = require('./connectDB.js');
const mongoose = require('mongoose');

/*const apiKey = 'AIzaSyAtnFTu-E6GUePD2AYOXwa2YXQugbb08Jc'; /*키1*/
/*const apiKey = 'AIzaSyBeiUVktH4Rtnw34NQP-z3BNo7X5uXX38Y'; //임시 키2*/
/*const apiKey = 'AIzaSyB5AzBrtWbFNlQxzIFMs_k6Fmel-7jmMUM'; /*임시 키3*/

const apiKey = 'AIzaSyDZN4lyCTEDWZV9H9P3cq4xIIDSUmc-y-w'; /*임시 키 4*/

const queries = [
    '팔 홈트레이닝 | Arms Home Training',
    '가슴 홈트레이닝 | Chest Home Training',
    '등 홈트레이닝 | Back Home Training',
    '어깨 홈트레이닝 | Shoulders Home Training',
    '복근 홈트레이닝 | Abs Home Training',
    '허벅지 홈트레이닝 | Thighs Home Training',
    '엉덩이 홈트레이닝 | Glutes Home Training',
    '전신 홈트레이닝 | Full Body Home Training',
    '유산소 홈트레이닝 | Cardio Home Training',
    '팔 홈트레이닝 숙련자 | Arms Home Training Advanced',
    '가슴 홈트레이닝 숙련자 | Chest Home Training Advanced',
    '등 홈트레이닝 숙련자 | Back Home Training Advanced',
    '어깨 홈트레이닝 숙련자 | Shoulders Home Training Advanced',
    '복근 홈트레이닝 숙련자 | Abs Home Training Advanced',
    '허벅지 홈트레이닝 숙련자 | Thighs Home Training Advanced',
    '엉덩이 홈트레이닝 숙련자 | Glutes Home Training Advanced',
    '전신 홈트레이닝 숙련자 | Full Body Home Training Advanced',
    '유산소 홈트레이닝 숙련자 | Cardio Home Training Advanced',
];

let currentIteration = 0;
const maxiterations = 1; // 50개씩 2번 추출하므로 max=2

//query에 대해 반복하는 함수
async function processAllQueries() {
    for (let keyword of queries) {
        console.log(
            `processing query : # ${currentIteration + 1} : ${keyword}`
        );
        await processSingleQuery(keyword);
        currentIteration++;
    }
}

// qeury를 수행하는 함수
async function processSingleQuery(query) {
    let nextPageToken = ''; //처음엔 공백
    let iteration = 0;
    let videoObject = [];
    await fetchYoutube(query, iteration, videoObject, nextPageToken);
    // 모든 페이지 데이터가 수집된 후 DB에 저장
    addVideoInfo(videoObject);
}

// API 키를 사용하여 유튜브 API에 검색 요청 보내기
async function fetchYoutube(query, iteration, videoObject, pageToken = '') {
    const fetchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
    )}
    &type=video&maxResults=10&videoType=any&key=${apiKey}&pageToken=${pageToken}`;

    if (iteration >= maxiterations) {
        return;
    }
    iteration++;

    try {
        const response = await fetch(fetchUrl);
        const data = await response.json();

        const results = await Promise.all(
            data.items.map(async item => {
                let { videoLength, videoLikes } = await fetchVidLength(
                    item.id.videoId
                );
                return {
                    video_id: item.id.videoId,
                    video_title: item.snippet.title,
                    video_description: item.snippet.description,
                    video_tag: query, // 검색 키워드가 들어가게 된다.
                    video_length: videoLength, //videoLength 값 사용
                    video_likes: videoLikes,
                };
            })
        );
        /*console.log('Results:', results);*/
        videoObject.push(...results); //video_object에 추가

        //페이지 토큰 설정
        let nextPageToken = data.nextPageToken;

        //다음페이지 진행
        if (nextPageToken) {
            await fetchYoutube(query, iteration, videoObject, nextPageToken);
        }
    } catch (err) {
        console.error('Error during API request:', err);
    }
}

//영상 시간 변환 함수
function convertTime(videoduration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = videoduration.match(regex);

    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    const seconds = parseInt(matches[3] || '0', 10);

    // 분과 초를 HH:mm:ss로 변환
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalSeconds;
}

//영상 시간을 가져오기 위한 함수
async function fetchVidLength(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();
        let video_length = data.items[0].contentDetails.duration;
        let video_likes = data.items[0].statistics.likeCount;
        video_length = convertTime(video_length);
        return { videoLength: video_length, videoLikes: video_likes };
    } catch (err) {
        console.error('Error during API details request;', err);
        return null;
    }
}

processAllQueries();
