
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
export {userLogin, userSignUp};