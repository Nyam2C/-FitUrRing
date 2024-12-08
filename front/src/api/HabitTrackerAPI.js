async function getGoal(){
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
        // const uri = '/dummy/Goal.json'
        // const response = await fetch(uri);

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

// async function getUserData(){
//     try{
//         //const uri = `/api/user`
//         //const response = await fetch(uri, {
//         //     method: "GET",
//         //     headers: {
//         //         //JWT
//         //         "Content-Type": "application/json",
//         //     },
//         // });
//         const uri = '/dummy/User.json'
//         const response = await fetch(uri);

//         if (!response.ok){
//             throw new Error('Network error', response.status);
//         }
//         const data = await response.json();
//         return data;
//     } catch(err) {
//         console.log(err.message);
//     }
// };


async function getUserData(){
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