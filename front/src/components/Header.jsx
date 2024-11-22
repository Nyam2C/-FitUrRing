import react from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './index.css';
import {ReactComponent as Logo} from '../assets/logo.svg';

function MyPage(props){
    if (props.userId){
        return (
            <span>
                <Link className="link large" to='/mypage'>My Page</Link>
                <Link className="link large" to='/sign'>Sign Out</Link>
            </span>
        );
    }
    else{
        return (
            <Link className="link large" to='/sign'>Sign in</Link>
        );
    }
}

function Header(){

    return (
        <div id="header">
            <Link className="logo link large" to='/'> 
                <Logo width='25pt' height='30pt' fill='#0072CE'/>
                <span>Fiturring</span> 
            </Link>
            <Link className="link large" to='/workout'>Workout</Link>
            <Link className="link large" to='/habitTracker'>Habit Tracker</Link>
            <Link className="link large" to='/routine'>Routine</Link>
            <Link className="link large" to='diet'>Diet</Link>
            <MyPage />
        </div>
    );
}

export default Header;