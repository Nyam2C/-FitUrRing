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
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });
}

async function getUserRoutines() {
    return await fetchWithOptions('/routine', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
    });
}

async function getRoutineVideos(routineName) {
    return await fetchWithOptions(`/routine/videos?routine_name=${routineName}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
    });
}

async function deleteRoutine(routineName) {
    return await fetchWithOptions('/routine', {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routine_name: routineName }),
    });
}

async function addRoutineVideo(data){
    //추후에 RoutineAPI로 옮기기

    try{
        const uri = `/api/routine/add`
        const response = await fetch(uri, {
            method: "PUT",  //POST가 아니고??
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if(!responseData || !response.ok) 
            throw new Error(responseData.message || '루틴을 불러오는데 실패했습니다.');
        else return data;
    } catch(err){
        console.log(err.message);
    }
}


export { addRoutineVideo, addExerciseRecord, getUserRoutines, getRoutineVideos, deleteRoutine };
