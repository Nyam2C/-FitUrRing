import react, { useState, useEffect } from 'react';

import {getUserData, changeUserData, userWithdraw} from '../api/UserAPI.js';
import Modal from '../components/common/Modal.jsx'; 

function MyPage(){
    const [user, setUser] = useState({
        user_id: '',
        user_password: '',
        user_name: '',
        user_gender: 0,
        user_birth: '',
        user_email: '',
        user_created_at: '',
        user_height: null,
        user_weight: null
    });
    const [newPW, setNewPW] = useState('');
    const [warning, setWarning] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        try{
            const data = await getUserData();
            setUser(data);
        } catch (err){
            alert(err);
            setUser(null);
        }
    }
    function handleConfirm(e){
        if (e.target.value !== newPW){
            setWarning(<p style={{color:'red'}}>  비밀번호가 일치하지 않습니다.</p>);
        }
        else setWarning(null);
    }
    async function handleSubmit(e){
        e.preventDefault();
        if (warning) {
            alert(warning);
            return;
        }

        // 업데이트할 데이터 객체 생성
        const updateData = {
            user_name: user.user_name,
            user_email: user.user_email,
            user_gender: user.user_gender,
            user_height: user.user_height,
            user_weight: user.user_weight
        };

        // 새 비밀번호가 있는 경우에만 포함
        if (newPW) {
            updateData.user_password = newPW;
        }

        try {
            const response = await changeUserData(updateData);
            if (response && response.success) {
                setUser(response.data);  // 서버에서 받은 새로운 데이터로 상태 업데이트
                setNewPW('');  // 비밀번호 입력 필드 초기화
                alert(response.message);
            } else {
                alert('정보 수정 실패');
            }
        } catch(err) {
            alert(err.message);
        }
    }
    async function handleWithdraw(e) {
        e.preventDefault();
        if (!newPW) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        
        if (window.confirm("정말로 탈퇴하시겠습니까?")) {
            const result = await userWithdraw(newPW);
            if (result.success) {
                alert(result.message);
                window.location.replace('/');
            } else {
                alert(result.message);
            }
        }
    }
    if (!user && !window.localStorage.getItem('accessToken'))    
        return (<h2>표시할 사항이 없습니다.</h2>);

    return (
        <div id="mypage">
            <label id="title">마이페이지</label>
            <form id="myPageForm" onSubmit={handleSubmit}>
                <table>
                    <tr>
                        <th>이름</th>
                        <td><input type="text" name="user_name" onChange={(e) => setUser({...user, user_name: e.target.value})} 
                                value={user.user_name}></input></td>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <td>{`${user.user_id}`}</td>
                    </tr>
                    <tr>
                        <th>비밀번호 변경</th>
                        <td>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="user_password" 
                                className="round-input"
                                onChange={(e) => setNewPW(e.target.value)} 
                                value={newPW}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{marginLeft: '5px'}}
                            >
                                {showPassword ? "숨기기" : "보기"}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th>비밀번호 재입력</th>
                        <td>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="confirm_password" 
                                className="round-input"
                                onChange={handleConfirm}
                            />
                            <br/>
                            <label>{warning}</label>
                        </td>
                    </tr>
                    <tr>
                        <th>생년월일</th>
                        <td>{`${user.user_birth}`}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td><input type="text" name="user_email" className="round-input" onChange={(e) => setUser({...user, user_email: e.target.value})} value={user.user_email}></input></td>
                    </tr>
                    <tr>
                        <th>성별</th>
                        <td>{`${(user.user_gender===0)?'남':'여'}`}</td>
                    </tr>
                    <tr>
                        <th>키</th>
                        <td><input type="number" className="round-input" name="user_height" onChange={(e) => setUser({...user, user_height: e.target.value})} value={user.user_height}></input></td>
                    </tr>
                    <tr>
                        <th>몸무게</th>
                        <td><input type="number" className="round-input" name="user_weight" onChange={(e) => setUser({...user, user_weight: e.target.value})} value={user.user_weight}></input></td>
                    </tr>
                    <tr>
                        <th>가입일시</th>
                        <td>{`${user.user_created_at}`}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>
                            <button type="submit">정보 수정</button>
                            <button type="button" onClick={()=>setShowModal(prev=>!prev)}>회원 탈퇴</button>
                        </td>
                    </tr>
                </table>
            </form>
            {showModal && 
                <Modal width="50vw" height="40vh">
                    <div style={{ position: 'relative', padding: '20px' }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                        <form onSubmit={handleWithdraw}>
                            <h2 className="modal-title">회원 탈퇴</h2>
                            <div>
                                <label>비밀번호를 입력해주세요</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    onChange={(e) => setNewPW(e.target.value)}
                                    className="round-input modal-input"
                                />
                            </div>
                            <div className="modal-checkbox-container">
                                <input 
                                    type="checkbox" 
                                    className="round-input"
                                    id="showPasswordCheckbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label 
                                    htmlFor="showPasswordCheckbox"
                                >
                                    비밀번호 표시
                                </label>
                            </div>
                            <button 
                                type="submit" 
                                className="modal-withdraw-btn"
                            >
                                탈퇴
                            </button>
                        </form>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default MyPage;