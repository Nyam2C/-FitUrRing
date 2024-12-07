import addVideo from '../crawl/addVideo.js';
import fetchVideo from '../crawl/fetchVideo.js';
import { queries } from '../config/config.js';

export default async function processAllQueries() {
    let currentIteration = 0;
    try {
        for (let keyword of queries) {
            console.log(
                `processing query: #${currentIteration + 1}: ${keyword}`
            );
            let nextPageToken = ''; //처음엔 공백
            let iteration = 0;
            let videoObject = [];

            await fetchVideo(keyword, iteration, videoObject, nextPageToken);

            // 모든 페이지 데이터가 수집된 후 DB에 저장
            addVideo(videoObject);

            currentIteration++;
        }
    } catch (err) {
        console.error(err);
        throw new Error('Error processing queries.');
    }
}
