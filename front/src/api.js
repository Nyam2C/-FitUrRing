
async function userLogin(userId, password){
    try{
        const uri = '/api/login'
        const response = await fetch(uri, {
             method: "POST",
             headers: {
                 "Conent-Type": "application/json",
             },
             body: JSON.stringify({ userId, password }),
         });
         
         if (response.ok){
            const data = await response.json();
            window.localStorage.setItem('accessToken', data.token);
         }
         else{
            throw new Error('Network error', response.status);
         }
    } catch(err) {
        console.error(err.message);
    }
}

async function userSignUp(body) {
    try{
        const uri = 'api/signup'
        const response = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (!response.ok){
            throw new Error("Network Error", response.status);
        }
        return response.ok;
    } catch(err){
        console.error(err.message);
    }
}
async function getUserData(){
    // try{
    //     const uri = `/api/user`
    //     const response = await fetch(uri, {
    //         method: "GET",
    //         headers: {
    //             "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
    //             "Content-Type": "application/json",
    //         },
    //     });

        // const uri = '/dummy/User.json'
        // const response = await fetch(uri);

        // if (!response.ok){
        //     throw new Error('Network error', response.status);
        // }
       const data = {
            user_id: 'idididididdd',
            user_password: 'klk',
            user_name: 'asdf',
            user_gender: 0,
            user_birthdate: '2024-11-11',
            user_email: 'asdf@asdf.com',
            user_created_at: new Date(),
            user_height: null,
            user_weight: null
            }
        // const data = await response.json();
        return data;
    // } catch(err) {
    //     console.log(err.message);
    // }
};

async function changeUserData(data){
    // const body = {}
    try{
        const uri = `/api/user/edit`
        const response = await fetch(uri, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
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

async function userLogout(){
    try{
        const uri = '/api/logout'
        const response = await fetch(uri, {
             method: "POST",
             headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                 "Conent-Type": "application/json",
             },
         });
         
         if (response.ok){
            await response.json();
            window.localStorage.setItem('accessToken', null);
         }
         else{
            throw new Error('Network error', response.status);
         }
    } catch(err) {
        console.error(err.message);
    }
}

async function userWithdraw(user) {
    const data = {...user, isWithdrawn: 1};
    const uri = '/api/user/withdraw'
    try{
        const response = await fetch(uri, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),        
        });
        if (response.ok){
            window.localStorage.setItem('accessToken', null);
            const res = await response.json();
            return res;
        }
        else{
            throw new Error('Network error', response.status);
        }
    } catch(err){
        console.error(err.message);
    }
    
}
 
export {userLogin, userSignUp, getUserData, changeUserData, userLogout, userWithdraw};