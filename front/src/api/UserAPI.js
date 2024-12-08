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
            return { success: true, message: data.message };
        } else {
            throw new Error(data.message || '로그인 실패');
        }
    } catch(err) {
        return { success: false, message: err.message };
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
        if(!data) throw new Error('회원가입 실패');
        return {message: data.message};
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
        if(!data) throw new Error('회원정보 조회 실패');
        else return data;
    } catch(err){
        console.log(err.message);
    }
};

async function changeUserData(userData) {
    try {
        const uri = `/api/user/edit`;
        const response = await fetch(uri, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || '회원정보 수정 실패');
        }
        
        return {
            success: true,
            message: responseData.message || '회원정보가 수정되었습니다',
            data: responseData
        };
    } catch (err) {
        console.error('회원정보 수정 에러:', err);
        return {
            success: false,
            message: err.message
        };
    }
}

async function userLogout() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('이미 로그아웃되었습니다');
        }

        const uri = '/api/user/signout';
        const response = await fetch(uri, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '로그아웃 실패');
        }
        
        // 성공적으로 로그아웃된 후에 localStorage 클리어
        window.localStorage.clear();
        return data; // 객체 자체를 반환
    } catch(err) {
        console.error('로그아웃 에러:', err);
        // 에러 발생 시에도 localStorage 클리어
        localStorage.clear();
        throw err;
    }
}

// handleLogout 함수 수정
async function handleLogout(e) {
    if (e) e.preventDefault();
    try {
        const result = await userLogout();
        console.log('로그아웃 결과:', result);
        window.location.replace('/');
    } catch(err) {
        console.error('로그아웃 실패:', err.message);
        window.location.replace('/');
    }
}

//soft delete가 아닐 시 수정 필요
async function userWithdraw(password) {
    const uri = '/api/user/withdraw'
    try {
        const response = await fetch(uri, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_password: password }),
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '회원탈퇴 실패');
        }
        
        window.localStorage.clear();
        return { success: true, message: data.message };
    } catch(err) {
        return { success: false, message: err.message };
    }
}

async function refreshAccessToken() {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',  // refreshToken 쿠키 전송을 위해 필요
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('토큰 갱신 실패');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error('토큰 갱신 중 에러:', error);
        throw error;
    }
}

async function getProfile() {
    try {
        let response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });

        // 401 에러 발생 시 토큰 갱신 시도
        if (response.status === 401) {
            const newAccessToken = await refreshAccessToken();
            
            // 새로운 토큰으로 다시 요청
            response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        }

        if (!response.ok) {
            throw new Error('프로필 조회 실패');
        }

        return await response.json();
    } catch (error) {
        console.error('프로필 조회 중 에러:', error);
        throw error;
    }
}

export {userLogin, userSignUp, getUserData, changeUserData, userLogout, userWithdraw, getProfile, refreshAccessToken};