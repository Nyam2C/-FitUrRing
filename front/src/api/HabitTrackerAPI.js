async function getGoal(){
    try{
        //const uri = `/api/habitTracker/goal`
        //const response = await fetch(uri, {
        //     method: "GET",
        //     headers: {
        //         //JWT
        //         "Content-Type": "application/json",
        //     },
        // });
        const uri = '/dummy/Goal.json'
        const response = await fetch(uri);
        if (!response.ok){
            throw new Error('Network error', response.status);
        }
        const data = await response.json();
        return data;
    } catch(err) {
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
                //JWT
                "Content-Type": "application/json",
            },
            body: JSON.stringify(goalData)
        });        
        if (!response.ok){
            throw new Error('Network error', response.status);
        }
        const res = await response.json();
        console.log(res);
        return res;
    } catch(err) {
        console.log(err);
    }
};

async function getUserData(){
    try{
        //const uri = `/api/user`
        //const response = await fetch(uri, {
        //     method: "GET",
        //     headers: {
        //         //JWT
        //         "Content-Type": "application/json",
        //     },
        // });
        const uri = '/dummy/User.json'
        const response = await fetch(uri);

        if (!response.ok){
            throw new Error('Network error', response.status);
        }
        const data = await response.json();
        return data;
    } catch(err) {
        console.log(err.message);
    }
};

async function getMonthlyRecord(year, month) {
    try{
        //const uri = `/api//habitTracker/records`
        //const response = await fetch(uri, {
        //     method: "GET",
        //     headers: {
        //         //JWT
        //         "Content-Type": "application/json",
        //     },
        //     body: {
        //         "period": `${year}-${month}`
        // }
        // });
        const uri = '/dummy/Exercise.json'
        //여기서 year, month에 맞는 것만 골라서 내보내야함...
        
        const response = await fetch(uri);

        if (!response.ok){
            throw new Error('Network error', response.status);
        }
        const data = await response.json();
        return data;
    } catch(err) {
        console.log(err.message);
    }
}


export {getGoal, addGoal, getUserData, getMonthlyRecord};