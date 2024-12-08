const { UserAchievement, UserDiet } = require('../models/user');
const Food100 = require('../models/food100');

const getDietData = async (user_id, date = null, start_date = null, end_date = null) => {
    let dietData;
    // 날짜 형식 변환 함수
    const formatDate = (dateString, isEndDate = false) => {
        const date = new Date(dateString);
        const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
        
        if (isEndDate) {
            // 종료일은 23:59:59.999로 설정
            kstDate.setHours(23, 59, 59, 999);
        } else {
            // 시작일은 00:00:00.000으로 설정
            kstDate.setHours(0, 0, 0, 0);
        }
        
        return kstDate;
    };

    if (start_date && end_date) {
        // 기간 조회
        const formattedStartDate = formatDate(start_date);
        const formattedEndDate = formatDate(end_date, true);
        console.log('Formatted dates:', formattedStartDate, formattedEndDate);

        // 수정된 쿼리: findOne 대신 find 사용
        dietData = await UserDiet.find({ 
            user_id,
            'diets.date': {
                $gte: formattedStartDate,
                $lte: formattedEndDate
            }
        }).lean();

        if (!dietData || dietData.length === 0) {
            throw new Error('식단 정보가 없습니다.');
        }

        // 모든 문서의 diets를 하나의 배열로 합치고 날짜 범위로 필터링
        const allDiets = dietData.reduce((acc, doc) => {
            const filteredDiets = doc.diets.filter(diet => 
                diet.date >= formattedStartDate && 
                diet.date <= formattedEndDate
            ).map(diet => ({
                date: diet.date,
                meals: {
                    breakfast: diet.meals.breakfast || [],
                    lunch: diet.meals.lunch || [],
                    dinner: diet.meals.dinner || []
                },
                _id: diet._id
            }));
            return [...acc, ...filteredDiets];
        }, []);

        if (allDiets.length === 0) {
            throw new Error('해당 기간의 식단 정보가 없습니다.');
        }

        // 날짜순으로 정렬
        allDiets.sort((a, b) => b.date - a.date);

        return {
            diets: allDiets
        };
    } else if (date) {
        // 특정 날짜 조회
        const startOfDay = formatDate(date);
        const endOfDay = formatDate(date, true);
        
        dietData = await UserDiet.findOne(
            { 
                user_id,
                'diets.date': {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            },
            { 'diets.$': 1 }
        ).lean();
    } else {
        // 최신 데이터 조회
        dietData = await UserDiet.findOne(
            { user_id }
        ).sort({ 'diets.date': -1 }).limit(14).lean();
    }

    if (!dietData || dietData.length === 0 || !dietData[0].diets || dietData[0].diets.length === 0) {
        throw new Error('식단 정보가 없습니다.');
    }

    return {
        diets: dietData[0].diets.map(diet => ({
            date: diet.date,
            meals: diet.meals
        }))
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
            console.log(result);

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
                diet => diet.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
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
                meal => meal.food_id.toString() === food_id.toString()
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
                message: '식단이 삭제되었습니다.'
            });

        } catch (error) {
            console.error('Error in deleteDiet:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    getFood: async (req, res) => {
        try {
            const foods = await Food100.find();
            res.json({
                status: 'success',
                message: '음식 목록을 회했습니다.',
                foods
            });
        } catch (error) {
            console.error('Error in getFood:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = dietController;