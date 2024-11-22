import react from 'react';
import {Link} from 'react-router-dom';

import './index.css';

const data = [
    {
        goal_weekly: 0,
        goal_daily: [0, 0, 0, 0, 0, 0, 0],
        goal_daily_time: '00:00',
    }
]


function UserStatus(){
    return (
        <div>
            <Link className="link large" to='/HabitTracker/Goal'>set Goal</Link>
        </div>
    );
}

function SideBar(props){

    return (
        <div>
            {(props.side === 'right')?(
            <div className="sidebar rightSide">
                <h3>SideBar</h3>
            </div>
            ):(
            <div className="sidebar leftSide">
                <h3>SideBar</h3>
                <UserStatus />
            </div>
            )
            }
        </div>
    );
}

export default SideBar;