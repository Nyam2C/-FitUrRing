async function getGoal(){
    const data = {
        "goal_weekly": 3,
        "goal_daily": [1, 1, 0, 0, 1, 0, 0],
        "goal_daily_time": "30:00",
        "goal_weight": 42
    }
    return data;
    try{
        const uri = `/api/habitTracker/goal`
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!data)
            throw new Error('목표 조회 실패');
        else return data;
    } catch(err){
        console.log(err.message);
    }
};

async function addGoal(goalData){
    // const body = {
    //     goal_weekly: goalData.goal_weekly,
    //     goal_daily: goalData.goal_daily,
    //     goal_daily_time: goalData.goal_daily_time,
    //     goal_weight: goalData.goal_weight
    //     }
    try{
        const uri = `/api/habitTracker/goal`
        const response = await fetch(uri, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(goalData)
        });      
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || '목표를 설정하는데 실패했습니다.');
        }
        else return responseData;
    } catch(err){
        console.log(err.message);
    }
};


async function getUserData(){
    const data = {
        "user_id": "ajou1973",
        "user_name": "김아주",
        "user_gender": 0,
        "user_age": 25,
        "user_email": "ajou1973f@ajou.ac.kr"
    }
    return data;
    try{
        const uri = `/api/user/profile`
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if(!data) throw new Error('회원정보 조회 실패');
        else return data;
    } catch(err){
        console.log(err.message);
    }
}


async function getMonthlyRecord(year, month) {
    const data = [
        {
            "date": "2024-11-01",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                },
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-11-08",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-11-11",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-11-27",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-12-02",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-12-07",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-12-27",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        },
        {
            "date": "2024-12-31",
            "exercises": [
                {
                    "_id": "6747313adeab7ea33db954d3",
                    "video_id": "v1xrOAONfAw",
                    "video_title": "홈트 - 가슴운동 '단! 17분! 보고 따라만 하세요!' [ Home training - Chest ]",
                    "video_description": "안녕하세요~! 배관장입니다! 홈트레이닝 가슴편! 단! 17분! 보고 따라만 하세요! 품태권도 김해진영점 경남 김해시 진영읍 본산 ...",
                    "video_tag": "가슴 홈트레이닝 | Chest Home Training",
                    "video_length": 1071,
                    "video_likes": 14,
                    "channel_title": "Men's Health UK",
                    "__v": 0
                }
            ]
        }    
    ]
    
    return data;    
    try{
        const uri = `/api/habitTracker/records?period=${year}-${month}`;
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
        });
        // const uri = '/dummy/Exercise.json'
        const data = await response.json();
        if(!data || !data.ok) 
            throw new Error(data.message || '기록을 불러오는데 실패했습니다.');
        else return data;
    } catch(err){
        console.log(err.message);
    }
}


export {getGoal, addGoal, getUserData, getMonthlyRecord};