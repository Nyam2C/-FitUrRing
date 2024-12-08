async function fetchWithOptions(url, options) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP 오류! 상태 코드: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("API 요청 중 에러 발생:", error.message);
        throw error;
    }
}

// 개별 함수들을 
 const addExerciseRecord = async (record) => {
    return await fetchWithOptions('/api/routine/records', {
        method: 'POST',
        body: JSON.stringify(record),
    });
};

 const getUserRoutines = async () => {
    try {
        const response = await fetchWithOptions('/api/routine', {
            method: 'GET',
        });
        
        // 빈 루틴도 표시할 수 있도록 ��환
        return response.map(routine => ({
            _id: routine._id,
            user_id: routine.user_id,
            routine_name: routine.routine_name,
            routine_exercises: routine.routine_exercises || [], // 빈 배열 처리
            created_at: routine.routine_created_at
        }));
    } catch (error) {
        console.error("루틴 데이터 가져오기 실패:", error);
        throw error;
    }
};

 const getRoutineVideos = async (routineName) => {
    // routineName이 null이거나 undefined인 경우 빈 배열 반환
    if (!routineName) {
        console.log("루틴 이름이 제공되지 않았습니다.");
        return [];
    }

    try {
        const response = await fetchWithOptions(`/api/routine/videos?routine_name=${encodeURIComponent(routineName)}`, {
            method: 'GET',
        });
        
        return response.map(video => ({
            title: video.video_title || '',
            duration: video.video_time || 0,
            link: video.video_url || '',
            thumbnail: video.video_thumbnail || ''
        }));
    } catch (error) {
        console.error("루틴 비디오 가져오기 실패:", error);
        return []; // 비디오가 없을 경우 빈 배열 반환
    }
};

 const createRoutine = async (routineName) => {
    return await fetchWithOptions('/api/routine', {
        method: 'POST',
        body: JSON.stringify({ routine_name: routineName }),
    });
};

 const deleteRoutine = async (routineName) => {
    return await fetchWithOptions('/api/routine', {
        method: 'DELETE',
        body: JSON.stringify({ routine_name: routineName }),
    });
}

async function addRoutineVideo(data){
    try{
        const uri = `/api/routine/add`
        const response = await fetch(uri, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if(!response.ok) {
            throw new Error(responseData.message || '루틴을 불러오는데 실패했습니다.');
        }
        return responseData; // 성공 시 응답 데이터 반환
    } catch(err){
        console.error("루틴 추가 중 오류:", err.message);
        throw err; // 에러를 상위로 전파
    }
}


export { addRoutineVideo, addExerciseRecord, getUserRoutines, getRoutineVideos, createRoutine, deleteRoutine };
