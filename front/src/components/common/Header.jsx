import react from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import '../index.css';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import { userLogout } from '../../api';

function Header(){
    async function handleSignOut() {
        try{ 
            const result = await userLogout();
            alert(result.message);
            window.location.reload();
        } catch(err) {
            alert(err.message);
            window.location.reload();
        }     
    }

    function MyPage(){
        if (localStorage.getItem('accessToken')){
            return (
                <span>
                    <Link class="link large" to='/mypage'>My Page</Link>
                    <label class="link large" onClick={handleSignOut}>Sign Out</label>
                </span>
            );
        }
        else{
            return (
                <Link class="link large" to='/sign'>Sign in</Link>
            );
        }
    }

    return (
        <div id="header">
            <Link class="logo link large" to='/'> 
                <Logo width='25pt' height='30pt' fill='#0072CE'/>
                <span>Fiturring</span> 
            </Link>
            <Link class="link large" to='/workout'>Workout</Link>
            <Link class="link large" to='/habitTracker'>Habit Tracker</Link>
            <Link class="link large" to='/routine'>Routine</Link>
            <Link class="link large" to='/diet'>Diet</Link>
            <MyPage />
        </div>
    );
}

export default Header;