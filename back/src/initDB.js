const mongoose = require('mongoose');
const { User, UserAchievement, UserDiet } = require('./models/user');
const Food100 = require('./models/food100');
const HabitTracker = require('./models/habittracker');
const Muscle = require('./models/muscle');
const Routine = require('./models/routine');
const Video = require('./models/video');

const initDB = async () => {
    try {
        // 현재 데이터베이스의 모든 컬렉션 출력
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('현재 데이터베이스의 컬렉션 목록:');
        collections.forEach(collection => {
            console.log(' -', collection.name);
        });

        // User 관련 스키마
        if (!mongoose.models.User) {
            mongoose.model('User', User);
            console.log('User 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.UserAchievement) {
            mongoose.model('UserAchievement', UserAchievement);
            console.log('UserAchievement 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.UserDiet) {
            mongoose.model('UserDiet', UserDiet);
            console.log('UserDiet 스키마가 생성되었습니다.');
        }

        // 추가 스키마들
        if (!mongoose.models.Food100) {
            mongoose.model('Food100', Food100);
            console.log('Food100 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.HabitTracker) {
            mongoose.model('HabitTracker', HabitTracker);
            console.log('HabitTracker 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.Muscle) {
            mongoose.model('Muscle', Muscle);
            console.log('Muscle 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.Routine) {
            mongoose.model('Routine', Routine);
            console.log('Routine 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.Video) {
            mongoose.model('Video', Video);
            console.log('Video 스키마가 생성되었습니다.');
        }

        console.log('모든 스키마 확인이 완료되었습니다.');

    } catch (error) {
        console.error('스키마 초기화 중 오류 발생:', error);
        throw error;
    }
};

module.exports = initDB;