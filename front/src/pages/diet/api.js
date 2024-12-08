const URL = '/api/diet';

async function fetchWithOptions(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP 오류! 상태 코드: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API 요청 중 에러 발생:', error.message);
        throw error;
    }
}

// KST로 날짜 변환하는 함수
const convertToKST = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + 9); // UTC+9
    return date.toISOString().split('T')[0];
};

const getDietData = async (date = null, start_date = null, end_date = null) => {
    const queryParams = new URLSearchParams();
    
    if (date) {
        queryParams.append('date', convertToKST(date));
    }
    if (start_date) {
        queryParams.append('start_date', convertToKST(start_date));
    }
    if (end_date) {
        // end_date는 해당 일자의 마지막 시간으로 설정
        const endDate = new Date(end_date);
        endDate.setHours(32, 59, 59, 999); // KST 23:59:59.999
        queryParams.append('end_date', convertToKST(endDate));
    }

    // 먼저 음식 데이터를 가져옵니다
    const foodResponse = await getFoodData();
    const foodMap = foodResponse.reduce((acc, food) => {
        acc[food.food_id] = food;
        return acc;
    }, {});

    const dietResponse = await fetchWithOptions(`${URL}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
    });

    // 각 식단의 음식 정보를 추가하고 날짜별로 정렬
    const dietsWithFoodInfo = dietResponse.diets
        .map(diet => ({
            date: convertToKST(diet.date),
            meals: {
                breakfast: diet.meals.breakfast.map(meal => ({
                    ...meal,
                    foodInfo: foodMap[meal.food_id] || null
                })),
                lunch: diet.meals.lunch.map(meal => ({
                    ...meal,
                    foodInfo: foodMap[meal.food_id] || null
                })),
                dinner: diet.meals.dinner.map(meal => ({
                    ...meal,
                    foodInfo: foodMap[meal.food_id] || null
                }))
            }
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
        user_name: dietResponse.user_name,
        diets: dietsWithFoodInfo
    };
};

const getUserData = async () => {
    return await fetchWithOptions(`api/user/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
    });
};

const createDiet = async ({ date, mealtime, food_id, grams }) => {
    return await fetchWithOptions(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ date, mealtime, food_id, grams }),
    });
};

const deleteDiet = async ({ date, mealtime, food_id }) => {
    return await fetchWithOptions(`${URL}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
            date, 
            mealtime, 
            food_id: Number(food_id)
        })
    });
};

const getFoodData = async () => {
    const response = await fetchWithOptions(`${URL}/food`, {
        method: 'GET',
    });
    return response.foods.map((food) => ({
        food_id: food.food_id,
        food_name: food.food_name,
        energy_kcal: food.energy_kcal,
        carbs: food.carbs,
        protein: food.protein,
        fat: food.fat
    }));
};

const getWeightHistory = async () => {
    const response = await fetchWithOptions('/api/user/weight-history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
    });

    // 날짜를 KST로 변환하고 데이터 정렬
    const sortedData = response.data
        .map(item => ({
            date: convertToKST(item.date),
            weight: item.user_weight
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedData;
};

export { getDietData, createDiet, deleteDiet, getUserData, getFoodData, getWeightHistory };