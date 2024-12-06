//운동 영상 구조
const Video = require('../models/video');

function addVideoInfo(infoList) {
    Video.insertMany(infoList, { ordered: false })
        .then(docs => {
            console.log('DB에 성공적으로 추가되었습니다 : ');
        })
        .catch(err => {
            console.error('DB에 추가하는 도중 오류가 발생하였습니다 : ');
        });
}

modulse.export = addVideoInfo;
