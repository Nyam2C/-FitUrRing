import mongoose from 'mongoose';

const DB_URL = 'mongodb://127.0.0.1:27017/wss_project_db';

//몽고DB에 연결하기
async function connect() {
    try {
        await mongoose.connect(DB_URL);
    } catch (error) {
        console.error('MongoDB 연결 실패:', error.message);
    }
}
connect();

// 필요한 schema 만들기
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
        type: Array,
    },
    video_tag: {
        //tag 부분을추가해주었다.
        type: String,
        required: true,
    },
    video_length: {
        type: Number /*ISO 8601 형식을 받아오나 filtering을 위해 초단위로 변환*/,
        /*required: true,*/
    },
    video_likes: {
        type: String,
    },
});
const VideoModel = mongoose.model('Video', videoSchema);

//insertMany를 활용해서 한번에 저장
export function addVideoInfo(infoList) {
    VideoModel.insertMany(infoList, { ordered: false })
        .then(docs => {
            console.log('DB에 성공적으로 추가되었습니다 : ');
        })
        .catch(err => {
            console.error('DB에 추가하는 도중 오류가 발생하였습니다 : ');
        });
}
