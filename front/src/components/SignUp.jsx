import react, { useState } from 'react';
import './index.css';
import { userSignUp } from '../api';

function SignUp(){
        const [userId, setUserId] = useState('');   
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState();
    const [gender, setGender] = useState(0);

    const handleConfirm = (e) => {
        if (e.target.value !== password){
            return (
                <label>비밀번호가 일치하지 않습니다.</label>
            )
        }   
    };

    function handleSignUp(e){
        e.preventDefault();
        const data = {
            user_id: userId,
            user_password: password,
            user_name: userName,
            user_gender: (gender === 'male')?0:1,
            user_birthdate: birthdate,
            user_email: email,
            user_created_at: new Date(),
        }
        //console.log(data)
        const ok = userSignUp(data);
        if (ok){
            alert("회원가입이 완료되었습니다.");
            window.location.reload();
        }
    }

    return (
        <>
            <form id="signUpForm" className='leftmove' onSubmit={handleSignUp}>
                <label id="title">Sign Up</label>
                <input required type="text" name="name" placeholder='성함' value={userName}
                        onChange={(e) => setUserName(e.target.value)}></input>
                <input required type="text" name="id" placeholder='ID' value={userId}
                        onChange={(e) => setUserId(e.target.value)} ></input>
                <input required type="password" name="pw" placeholder='PW' value={password}
                        onChange={(e) => setPassword(e.target.value)}></input>
                <input required type="password" name="pwConfirm" placeholder='PW를 한번 더 입력해주세요' 
                        onChange={handleConfirm}></input>
                <input required type="email" name="email" placeholder='이메일' value={email}
                        onChange={(e) => setEmail(e.target.value)}></input>
                <div className='inputbox'>
                    <label>남</label>
                    <input type="radio" name="gender" value={"male"} onChange={(e) => setGender(e.target.value)}></input>
                    <label>여</label>
                    <input type="radio" name="gender" value={"female"} onChange={(e) => setGender(e.target.value)}></input>
                </div>
                <div className='inputbox'>
                    <label>생년월일</label>
                    <input type="date" placeholder="생년월일" name="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}></input>
                </div>
                {/* <div style={{display: "flex", width: "30em", justifyContent: "center"}}>
                    <input id="age" type="number" name="age" placeholder='나이'></input>
                    <input id="height" type="number" name="height" placeholder='키'></input>
                    <input id="weight" type="number" name="weight" placeholder='몸무게'></input>
                </div> */}
    
                <button type="submit">sign up</button>
            </form>
        </>
    );
}

export default SignUp;