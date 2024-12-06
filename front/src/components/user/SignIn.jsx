import react, { useState } from 'react';
import '../index.css';
import { userLogin } from '../../api';

function SignIn(){
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignIn(e){
        e.preventDefault();
        const data = {
            user_id: userId,
            user_password: password
        }
        try{ 
            const response = await userLogin(data);
            if(response.success) {
                window.location.href = '/home';
            } else {
                alert(response.message);
            }
        } catch(err) {
            alert(err.message);
        } 
    }

    return (
        <form id="signInForm" className="rightmove" onSubmit={handleSignIn}>
            <label id="title">Sign In</label>
            <input type="text" name="id" placeholder='ID' onChange={(e) => setUserId(e.target.value)} value={userId}></input>
            <input type="password" name="pw" placeholder='PW'onChange={(e) => setPassword(e.target.value)} value={password}></input>
            <button type="submit">sign in</button>
        </form>
    );
}

export default SignIn;