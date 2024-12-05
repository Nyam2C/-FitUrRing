const mongoose = require('mongoose');
const mongoUrl = `mongodb://wss-db:27017`;

//몽고DB에 연결하기
async function connect() {
    try {
        await mongoose.connect(mongoUrl);
    } catch (error) {
        console.error('MongoDB 연결 실패:', error.message);
    }
}
connect();

const fetchYoutube = require('./utils/fetchYoutube');
const addVideoInfo = require('./utils/addVideoDB');

/*const apiKey = 'AIzaSyAtnFTu-E6GUePD2AYOXwa2YXQugbb08Jc'; /*키1*/
/*const apiKey = 'AIzaSyBeiUVktH4Rtnw34NQP-z3BNo7X5uXX38Y'; //임시 키2*/
/*const apiKey = 'AIzaSyB5AzBrtWbFNlQxzIFMs_k6Fmel-7jmMUM'; /*임시 키3*/
/*const apiKey = 'AIzaSyDZN4lyCTEDWZV9H9P3cq4xIIDSUmc-y-w'; /*임시 키 4*/

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
const maxiterations = 2; //50개씩 2번 추출하므로 max=2

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

processAllQueries();
