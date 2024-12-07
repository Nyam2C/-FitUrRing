import Video from '../db/model/video.js';

//random ID 생성
const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateId = (length = 16) => {
    let result = '';
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.random() * characters.length);
    return result;
};

//더미데이터 삽입
async function generateDummy(batch = 1000, totalCount = 100000) {
    try {
        let dummyData = [];
        for (let i = 0; i < totalCount; i++) {
            dummyData.push({
                video_id: generateId(16),
                video_title: generateId(16),
                video_description: 'description',
                video_tag: 'dummy tag',
                video_length: Math.floor(Math.random() * 3600 + 60), //1~60분
                video_likes: Math.floor(Math.random() * 10000), // 1~10000
                channel_title: 'testtitles',
            });

            if (dummyData.length === batch) {
                await Video.insertMany(dummyData);
                dummyData = []; //초기화
            }
        }
        if (dummyData.length > 0) {
            await Video.insertMany(dummyData);
        }
        console.log(`${totalCount} dummy datas are successfully added`);
    } catch (error) {
        consoler.error('Error during making dummies:', error);
    }
}
