const fetchVidLength = require('./fetchVideoLength');

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

modules.export = fetchYoutube;
