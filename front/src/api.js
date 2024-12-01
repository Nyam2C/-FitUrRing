
async function userLogin(body){
        try{
            const uri = '/api/user/signin'
            const response = await fetch(uri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok && data.accessToken){
                window.localStorage.setItem('accessToken', data.accessToken);
                window.localStorage.setItem('user_id', data.user_id);
                window.localStorage.setItem('user_name', data.user_name);
                return data.message;
            }
            else{
                throw new Error(data.message);
            }
        } catch(err) {
            console.log(err.message);
        }
    }

async function userSignUp(body) {
    try{
        const uri = '/api/user/signup'
        const response = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok && data.user_id){
            return data.message;
        }
        else{
            throw new Error(data.message);
        }
    } catch(err){
        console.log(err.message);
    }
}
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
        if (response.ok && data.success){
            return data;
        }
        else{
            throw new Error(data.message);
        }
    } catch(err){
        console.log(err.message);
    }
    //    const data = {
    //         user_id: 'idididididdd',
    //         user_password: 'klk',
    //         user_name: 'asdf',
    //         user_gender: 0,
    //         user_birthdate: '2024-11-11',
    //         user_email: 'asdf@asdf.com',
    //         user_created_at: new Date(),
    //         user_height: null,
    //         user_weight: null
    //     }
};

async function changeUserData(data){
    // const body = {}
    try{
        const uri = `/api/user/edit`
        const response = await fetch(uri, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const data = await response.json();
        if (response.ok && data.success){
            return data;
        }
        else{
            throw new Error(data.message);
        }
    } catch(err){
        console.log(err.message);
    }
};

async function userLogout(){
    try{
        const uri = '/api/user/signout'
        const response = await fetch(uri, {
             method: "POST",
             headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
             },
         });
         const data = await response.json();
         if (response.ok){
            window.localStorage.setItem('accessToken', null);
            window.localStorage.setItem('user_id', null);
            window.localStorage.setItem('user_name', null);
            return data.message;
         }
         else{
            throw new Error(data.message);
        }
    } catch(err) {
        console.log(err.message);
    }
}

//soft delete가 아닐 시 수정 필요
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
        const data = response.json();
        if (response.ok && data.success){
            window.localStorage.setItem('accessToken', null);
            window.localStorage.setItem('user_id', null);
            window.localStorage.setItem('user_name', null);
            return data.message;
        }
        else{
            throw new Error(data.message);
        }
    } catch(err){
        console.error(err.message);
    }
    
}
 
export {userLogin, userSignUp, getUserData, changeUserData, userLogout, userWithdraw};