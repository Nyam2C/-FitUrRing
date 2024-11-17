import react from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './Header.css';
import {ReactComponent as Logo} from '../assets/logo.svg';

function MyPage(props){
    if (props.userId){
        return (
            <span>
                <Link class="link" to='/mypage'>My Page</Link>
                <Link class="link" to='/signout'>Sign Out</Link>
            </span>
        );
    }
    else{
        return (
            <Link class="link" to='/signin'>Sign in</Link>
        );
    }
}

function Header(){

    return (
            <div id="header">
                <Link class="logo link" to='/'> 
                    <Logo width='25pt' height='30pt' fill='#0072CE'/>
                    <span>Fiturring</span> 
                </Link>
                <Link class="link" to='/workout'>Workout</Link>
                <Link class="link" to='/habitTracker'>Habit Tracker</Link>
                <Link class="link" to='/routine'>Routine</Link>
                <MyPage />
            </div>
    );
}

export default Header;