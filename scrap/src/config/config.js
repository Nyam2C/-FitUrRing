import dotenv from 'dotenv';
dotenv.config();

export const dbURL = 'mongodb://wss-db:27017'; // MongoDB connection
export const apiKey = process.env.YOUTUBE_API_KEY_1; // 유튜브 api key
export const maxIterations = 2; //반복횟수
export const queries = [
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
