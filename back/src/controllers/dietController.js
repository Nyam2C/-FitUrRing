const { UserAchievement, UserDiet } = require('../models/user');

const getDietData = async (user_id, date = null, start_date = null, end_date = null) => {
    let dietQuery;

    if (start_date && end_date) {
        // 기간 조회
        dietQuery = UserDiet.findOne(
            { 
                user_id,
                'diets.date': {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                }
            },
            { 
                'diets': {
                    $elemMatch: {
                        date: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                }
            }
        );
    } else if (date) {
        // 특정 날짜 조회
        dietQuery = UserDiet.findOne(
            { 
                user_id,
                'diets.date': new Date(date)
            },
            { 'diets.$': 1 }
        );
    } else {
        // 최신 데이터 조회
        dietQuery = UserDiet.findOne(
            { user_id }
        ).sort({ 'diets.date': -1 }).limit(1);
    }

    const diet = await dietQuery.lean();
    
    if (!diet || !diet.diets || diet.diets.length === 0) {
        throw new Error(
            start_date && end_date ? 
                `${start_date}부터 ${end_date}까지의 식단 정보가 없습니다.` :
                date ? 
                    `${date} 날짜의 식단 정보가 없습니다.` : 
                    '등록된 식단 정보가 없습니다.'
        );
    }

    const targetDate = diet.diets[0].date;
    const dayOfWeek = targetDate.getDay();
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    let achievement = await UserAchievement.findOne(
        {
            user_id,
            'achievements.date': weekStart
        },
        {
            'achievements.$': 1
        }
    ).lean();

    if (!achievement) {
        achievement = await UserAchievement.findOne(
            {
                user_id,
                'achievements.date': { $lt: weekStart }
            },
            {
                'achievements': { 
                    $elemMatch: { 
                        date: { $lt: weekStart } 
                    }
                }
            }
        ).sort({ 'achievements.date': -1 }).lean();

        if (!achievement) {
            throw new Error('사용자의 신체 정보가 없습니다.');
        }
    }

    return {
        date: diet.diets[0].date,
        meals: diet.diets[0].meals,
        achievement: {
            height: achievement.achievements[0].height,
            weight: achievement.achievements[0].weight,
            goal_weight: achievement.achievements[0].goal_weight,
            is_current_week: achievement.achievements[0].date.getTime() === weekStart.getTime()
        }
    };
};

const dietController = {
    getDiet: async (req, res) => {
        try {
            const { user_id, user_name } = req.user;
            const { date, start_date, end_date } = req.query;
            
            const result = await getDietData(user_id, date, start_date, end_date);
            res.json({
                user_name,
                ...result
            });

        } catch (error) {
            console.error('Error in getDiet:', error);
            res.status(404).json({ 
                status: 'error',
                message: error.message 
            });
        }
    },

    createDiet: async (req, res) => {
        try {
            const { user_id } = req.user;
            const { date, mealtime, food_id, grams } = req.body;

            if (!date || !mealtime || !food_id || !grams) {
                return res.status(400).json({
                    status: 'error',
                    message: '필수 입력값이 누락되었습니다.'
                });
            }

            // mealtime 유효성 검사
            if (!['breakfast', 'lunch', 'dinner'].includes(mealtime)) {
                return res.status(400).json({
                    status: 'error',
                    message: '잘못된 식사 시간입니다.'
                });
            }

            // 해당 날짜의 사용자 식단 찾기
            let userDiet = await UserDiet.findOne({
                user_id,
                'diets.date': new Date(date)
            });

            if (!userDiet) {
                // 해당 날짜의 식단이 없으면 새로 생성
                userDiet = new UserDiet({
                    user_id,
                    diets: [{
                        date: new Date(date),
                        meals: {
                            breakfast: [],
                            lunch: [],
                            dinner: []
                        }
                    }]
                });
            }

            // 해당 날짜의 diet 찾기
            const dietIndex = userDiet.diets.findIndex(
                diet => diet.date.getTime() === new Date(date).getTime()
            );

            if (dietIndex === -1) {
                // 해당 날짜의 diet가 없으면 새로 추가
                userDiet.diets.push({
                    date: new Date(date),
                    meals: {
                        breakfast: [],
                        lunch: [],
                        dinner: []
                    }
                });
            }

            // 식사 추가
            const targetDiet = userDiet.diets[dietIndex !== -1 ? dietIndex : userDiet.diets.length - 1];
            
            // 동일한 음식이 있는지 확인
            const existingFoodIndex = targetDiet.meals[mealtime].findIndex(
                meal => meal.food_id === food_id
            );

            if (existingFoodIndex !== -1) {
                // 이미 존재하는 음식이면 그램수 업데이트
                targetDiet.meals[mealtime][existingFoodIndex].grams = grams;
            } else {
                // 새로운 음식 추가
                targetDiet.meals[mealtime].push({
                    food_id,
                    grams
                });
            }

            await userDiet.save();

            res.status(201).json({
                status: 'success',
                message: '식단이 등록되었습니다.',
                data: {
                    date: targetDiet.date,
                    mealtime,
                    food_id,
                    grams
                }
            });

        } catch (error) {
            console.error('Error in createDiet:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },
    deleteDiet: async (req, res) => {
        try {
            const { user_id } = req.user;
            const { date, mealtime, food_id } = req.body;

            if (!date || !mealtime || !food_id) {
                return res.status(400).json({
                    status: 'error',
                    message: '필수 입력값이 누락되었습니다.'
                });
            }

            // mealtime 유효성 검사
            if (!['breakfast', 'lunch', 'dinner'].includes(mealtime)) {
                return res.status(400).json({
                    status: 'error',
                    message: '잘못된 식사 시간입니다.'
                });
            }

            // 해당 날짜의 사용자 식단 찾기
            const userDiet = await UserDiet.findOne({
                user_id,
                'diets.date': new Date(date)
            });

            if (!userDiet) {
                return res.status(404).json({
                    status: 'error',
                    message: '해당 날짜의 식단이 없습니다.'
                });
            }

            // 해당 날짜의 diet 찾기
            const dietIndex = userDiet.diets.findIndex(
                diet => diet.date.getTime() === new Date(date).getTime()
            );

            if (dietIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    message: '해당 날짜의 식단이 없습니다.'
                });
            }

            // 해당 음식 찾기 및 삭제
            const targetDiet = userDiet.diets[dietIndex];
            const foodIndex = targetDiet.meals[mealtime].findIndex(
                meal => meal.food_id === food_id
            );

            if (foodIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    message: '해당 음식을 찾을 수 없습니다.'
                });
            }

            // 음식 삭제
            targetDiet.meals[mealtime].splice(foodIndex, 1);

            // 해당 식사 시간의 음식이 모두 비었고, 다른 식사 시간도 비어있다면 해당 날짜 전체 삭제
            if (targetDiet.meals[mealtime].length === 0 &&
                targetDiet.meals.breakfast.length === 0 &&
                targetDiet.meals.lunch.length === 0 &&
                targetDiet.meals.dinner.length === 0) {
                userDiet.diets.splice(dietIndex, 1);
            }

            // diets 배열이 비어있다면 문서 전체 삭제
            if (userDiet.diets.length === 0) {
                await UserDiet.deleteOne({ _id: userDiet._id });
            } else {
                await userDiet.save();
            }

            res.json({
                status: 'success',
                message: '식단이 삭제되었습니다.',
                data: {
                    date,
                    mealtime,
                    food_id
                }
            });

        } catch (error) {
            console.error('Error in deleteDiet:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = { dietController };