const mongoose = require('mongoose');
const { User, UserAchievement, UserDiet } = require('./models/user');
const Food100 = require('./models/food100');
const HabitTracker = require('./models/habittracker');
const Muscle = require('./models/muscle');
const Routine = require('./models/routine');
const Video = require('./models/video');

// 타임스탬프 옵션 (KST 시간 사용)
const timestampOptions = {
    timestamps: {
        currentTime: () => new Date(Date.now() + (9 * 60 * 60 * 1000))  // KST (+9시간)
    }
};

const initDB = async () => {
    try {
        // 현재 데이터베이스의 모든 컬렉션 출력
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('현재 데이터베이스의 컬렉션 목록:');
        collections.forEach(collection => {
            console.log(' -', collection.name);
        });

        // 각 스키마에 타임스탬프 옵션 적용
        if (!mongoose.models.User) {
            const schema = User;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('User', schema);
            console.log('User 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.UserAchievement) {
            const schema = UserAchievement;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('UserAchievement', schema);
            console.log('UserAchievement 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.UserDiet) {
            const schema = UserDiet;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('UserDiet', schema);
            console.log('UserDiet 스키마가 생성되었습니다.');
        }

        // 추가 스키마들
        if (!mongoose.models.Food100) {
            const schema = Food100;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('Food100', schema);
            console.log('Food100 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.HabitTracker) {
            const schema = HabitTracker;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('HabitTracker', schema);
            console.log('HabitTracker 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.Muscle) {
            const schema = Muscle;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('Muscle', schema);
            console.log('Muscle 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.Routine) {
            const schema = Routine;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('Routine', schema);
            console.log('Routine 스키마가 생성되었습니다.');
        }

        if (!mongoose.models.Video) {
            const schema = Video;
            schema.set('timestamps', timestampOptions.timestamps);
            mongoose.model('Video', schema);
            console.log('Video 스키마가 생성되었습니다.');
        }

        console.log('모든 스키마 확인이 완료되었습니다.');

    } catch (error) {
        console.error('스키마 초기화 중 오류 발생:', error);
        throw error;
    }
};

module.exports = initDB;