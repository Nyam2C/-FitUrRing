import react from 'react';
import {Link} from 'react-router-dom';

import './index.css';
import ExerciseBlock from './ExerciseBlock';

const userData = {
    user_id: 'asdf',
    user_name: '김ㅇㅇ',
    user_gender: 0,
    user_age: 10,
    user_email: 'asdf@adf.com',
    user_phone: '010-0000-0000',
    }

const data = 
    {
        goal_weekly: 0,
        goal_daily: [0, 0, 0, 0, 0, 0, 0],
        goal_daily_time: '00:00',
    }

const exerciseData = 
    { 
        date:'2024-11-01',
        exercises: [{
            video_title: 'workout1',
            video_tag: 'head',
            video_time: '10:49'
        },
        {
            video_title: 'workout6',
            video_tag: 'neck',
            video_time: '22:49'
        },],
    };

function UserStatus({userData, data}){
    return (
        <div>
            <div id="userInfo">
                <div>{userData.user_name}</div>
                <div>성별: {userData.user_gender}</div>
                <div>나이: {userData.user_age}</div>
            </div>
            <div className="card">
                <div>주간 목표 시간: {data.goal_weekly}</div>
                <div>목표 요일: {data.goal_daily}</div>
                <div>일일 목표 시간: {data.goal_daily_time}</div>
            </div>
            <button>
                <Link className="link large" to='/HabitTracker/Goal'>
                목표 설정
                </Link>
            </button>
        </div>
    );
    };

function DailyDetails({onShow}){
    //날짜 + ExerciseBlock(clickable)
    return (
        <>
            <button onClick={onShow}>X</button>
            <ExerciseBlock 
            data={exerciseData}
            mode={'clickable'}/>
        </>
    );
}

function SideBar({side, onDetail}){
    function onShow(){
        onDetail(false);
    }

    return (
        (side === 'right')?(
        <div className="sidebar rightSide flex-grow-side">
            <DailyDetails 
            onShow={onShow}/>
        </div>
        ):(
        <div className="sidebar leftSide flex-grow-side">
            <UserStatus 
            userData={userData}
            data={data}
            />
        </div>
        )
    );
}

export default SideBar;