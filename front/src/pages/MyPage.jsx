import react, { useState, useEffect } from 'react';

import {getUserData, changeUserData, userWithdraw} from '../api.js';
import Modal from '../components/Modal.jsx'; 

function MyPage(){
    const [user, setUser] = useState({
        user_id: '',
        user_password: '',
        user_name: '',
        user_gender: 0,
        user_birthdate: '',
        user_email: '',
        user_created_at: '',
        user_height: null,
        user_weight: null
    });
    const [newPW, setNewPW] = useState('');
    const [warning, setWarning] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        try{
            const data = await getUserData();
            setUser(data);
        } catch (error){
            console.error(error.message);
        }
    }
    function handleConfirm(e){
        if (e.target.value !== newPW){
            setWarning(<p style={{color:'red'}}>  비밀번호가 일치하지 않습니다.</p>);
        }
        else setWarning(null);
    }
    function handleSubmit(e){
        e.preventDefault();
        const data = user;
        if (warning){
            alert("비밀번호가 일치하지 않습니다.");
            window.location.reload();
        }
        const response = changeUserData(data);
        if (response.ok){
            alert("성공적으로 저장되었습니다.");
            window.location.reload();
        }
    }
    function handleWithdraw(e){
        e.preventDefault();
        console.log(newPW);
        if (user.user_password === newPW)   userWithdraw(user);
        else{
            alert("비밀번호가 일치하지 않습니다.");
            window.location.reload();
        }
    }
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
                        {/* <td><input type="text" name="user_id" value={user.user_id}></input></td> */}
                        <td>{`${user.user_id}`}</td>
                    </tr>
                    <tr>
                        <th>비밀번호 변경</th>
                        <td><input type="text" name="user_password" onChange={(e) => setNewPW(e.target.value)} value={newPW}></input></td>
                    </tr>
                    <tr>
                        <th>비밀번호 재입력</th>
                        <td><input type="text" name="confirm_password" onChange={handleConfirm}></input><br/>
                            <label>{warning}</label></td>
                    </tr>
                    <tr>
                        <th>생년월일</th>
                        {/* <td><input type="text" name="user_gender" value={user.user_birthdate}></input></td> */}
                        <td>{`${user.user_birthdate}`}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td><input type="text" name="user_email" onChange={(e) => setUser({...user, user_email: e.target.value})} value={user.user_email}></input></td>
                    </tr>
                    <tr>
                        <th>성별</th>
                        {/* <td><input type="text" name="user_gender" value={(user.user_gender===0)?'남':'여'}></input></td> */}
                        <td>{`${(user.user_gender===0)?'남':'여'}`}</td>
                    </tr>
                    <tr>
                        <th>키</th>
                        <td><input type="number" name="user_height" onChange={(e) => setUser({...user, user_height: e.target.value})} value={user.user_height}></input></td>
                    </tr>
                    <tr>
                        <th>몸무게</th>
                        <td><input type="number" name="user_weight" onChange={(e) => setUser({...user, user_weight: e.target.value})} value={user.user_weight}></input></td>
                    </tr>
                    <tr>
                        <th>가입일시</th>
                        <td>{`${user.user_created_at}`}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td><button>정보 수정</button> <button type="button" onClick={()=>setShowModal(prev=>!prev)}> 회원 탈퇴</button></td>
                    </tr>
                </table>
            </form>
            {showModal && <Modal width="50vw" height="40vh">
                <form onSubmit={handleWithdraw}>
                    <label id="title">회원 탈퇴</label>
                    <label>비밀번호를 입력해주세요</label>
                    <input type="text" onChange={(e)=>setNewPW(e.target.value)}></input>
                    <button style={{backgroundColor:'red', color:'white'}}>탈퇴</button>
                </form>
                </Modal>}
        </div>
    )
}


export default MyPage;