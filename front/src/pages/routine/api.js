async function fetchWithOptions(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API 요청 중 에러 발생:", error.message);
        throw error;
    }
}

async function addExerciseRecord(record) {
    return await fetchWithOptions('/routine/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });
}

async function getUserRoutines() {
    return await fetchWithOptions('/routine', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function getRoutineVideos(routineName) {
    return await fetchWithOptions(`/routine/videos?routine_name=${routineName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function deleteRoutine(routineName) {
    return await fetchWithOptions('/routine', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routine_name: routineName }),
    });
}

export { addExerciseRecord, getUserRoutines, getRoutineVideos, deleteRoutine };
