const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
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

const foodOptions = [
    { food_id:1, name: "계란", calories: 70, carbs: 1, protein: 6, fat: 5 },
    { food_id:2, name: "밥", calories: 300, carbs: 68, protein: 6, fat: 0.5 },
    { food_id:3, name: "닭가슴살", calories: 120, carbs: 0, protein: 23, fat: 2 },
    { food_id:4, name: "사과", calories: 80, carbs: 21, protein: 0.5, fat: 0.3 },
    { food_id:5, name: "고구마", calories: 86, carbs: 20, protein: 1.6, fat: 0.1 },
    { food_id:6, name: "바나나", calories: 89, carbs: 23, protein: 1.1, fat: 0.3 },
    { food_id:7, name: "오렌지", calories: 62, carbs: 15, protein: 1.2, fat: 0.2 },
    { food_id:8, name: "소고기", calories: 250, carbs: 0, protein: 26, fat: 17 },
    { food_id:9, name: "돼지고기", calories: 242, carbs: 0, protein: 27, fat: 14 },
    { food_id:10, name: "고등어", calories: 189, carbs: 0, protein: 20, fat: 12 },
    { food_id:11, name: "연어", calories: 206, carbs: 0, protein: 22, fat: 13 },
    { food_id:12, name: "두부", calories: 76, carbs: 1.9, protein: 8, fat: 4.8 },
    { food_id:13, name: "김치", calories: 33, carbs: 6.1, protein: 1.1, fat: 0.2 },
    { food_id:14, name: "우유", calories: 42, carbs: 5, protein: 3.4, fat: 1 },
    { food_id:15, name: "요거트", calories: 59, carbs: 3.6, protein: 10, fat: 0.4 },
    { food_id:16, name: "치킨", calories: 239, carbs: 0, protein: 27, fat: 14 },
    { food_id:17, name: "고추", calories: 40, carbs: 9, protein: 2, fat: 0.4 },
    { food_id:18, name: "양파", calories: 40, carbs: 9, protein: 1.1, fat: 0.1 },
    { food_id:19, name: "당근", calories: 41, carbs: 10, protein: 0.9, fat: 0.2 },
    { food_id:20, name: "감자", calories: 77, carbs: 17, protein: 2, fat: 0.1 },
    { food_id:21, name: "브로콜리", calories: 34, carbs: 7, protein: 2.8, fat: 0.4 },
    { food_id:22, name: "호박", calories: 26, carbs: 6.5, protein: 1, fat: 0.1 },
    { food_id:23, name: "치즈", calories: 402, carbs: 1.3, protein: 25, fat: 33 },
    { food_id:24, name: "햄", calories: 145, carbs: 1.3, protein: 20, fat: 7 },
    { food_id:25, name: "소시지", calories: 301, carbs: 2, protein: 11, fat: 28 },
    { food_id:26, name: "초콜릿", calories: 546, carbs: 61, protein: 4.9, fat: 31 },
    { food_id:27, name: "아몬드", calories: 576, carbs: 21, protein: 21, fat: 49 },
    { food_id:28, name: "땅콩", calories: 567, carbs: 16, protein: 25, fat: 49 },
    { food_id:29, name: "식빵", calories: 265, carbs: 49, protein: 9, fat: 3.2 },
    { food_id:30, name: "파스타", calories: 131, carbs: 25, protein: 5, fat: 1.1 },
];

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

        // Food100 컬렉션 초기화
        await Food100.deleteMany();
        console.log('Food100 컬렉션이 초기화되었습니다.');

        // Food100 데이터 추가
        const foodData = foodOptions.map(item => ({
            food_id: item.food_id,
            food_name: item.name,
            energy_kcal: item.calories,
            carbohydrate: item.carbs,
            protein: item.protein,
            fat: item.fat
        }));

        await Food100.insertMany(foodData);
        console.log('Food100 데이터가 성공적으로 추가되었습니다.');

        // 추가 스키마들
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

        // Video 컬렉션 초기화
        await Video.deleteMany();
        console.log('Video 컬렉션이 초기화되었습니다.');

        // CSV 파일에서 비디오 데이터 읽기
        const videos = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, 'models/local.videos.csv'))
                .pipe(csv())
                .on('data', (data) => {
                    videos.push({
                        video_id: data.video_id,
                        video_title: data.video_title,
                        video_description: data.video_description,
                        video_tag: data.video_tag,
                        video_length: parseInt(data.video_length),
                        video_likes: parseInt(data.video_likes),
                        channel_title: data.channel_title
                    });
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // 비디오 데이터 삽입
        await Video.insertMany(videos);
        console.log(`${videos.length}개의 비디오 데이터가 성공적으로 추가되었습니다.`);

        console.log('모든 스키마 확인이 완료되었습니다.');

    } catch (error) {
        console.error('스키마 초기화 중 오류 발생:', error);
        throw error;
    }
};

module.exports = initDB;