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

const getDietData = async (date = null, start_date = null, end_date = null) => {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);
    if (start_date) queryParams.append('start_date', start_date);
    if (end_date) queryParams.append('end_date', end_date);

    return await fetchWithOptions(`${URL}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getUserData = async (fields = []) => {
    const queryParams = new URLSearchParams();
    if (fields.length > 0) {
        queryParams.append('fields', fields.join(',')); 
    }
    return await fetchWithOptions(`api/user/profile?${queryParams.toString()}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

const createDiet = async ({ date, mealtime, food_id, grams }) => {
    return await fetchWithOptions(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, mealtime, food_id, grams }),
    });
};

const deleteDiet = async ({ date, mealtime, food_id }) => {
    return await fetchWithOptions(URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, mealtime, food_id }),
    });
};

export { getDietData, createDiet, deleteDiet, getUserData };