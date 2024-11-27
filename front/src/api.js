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
        console.log(data);
        return data;
    } catch(err) {
        console.log(err.message);
    }
};

async function addGoal(data){
    try{
        const response = await fetch(`/api/habitTracker/goal`,{
            method: "PUT",
            headers: {
                //JWT
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export {getGoal, addGoal};