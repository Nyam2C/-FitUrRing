import react, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import '../index.css';
import ExerciseBlock from './ExerciseBlock';
import { getGoal, getUserData } from '../../api/HabitTrackerAPI';



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


    
function refineGoals(data){
    let result = '';
    for (let i=0; i<7; i++){
        if (data[i] === 1){
            switch(i) {
                case 1:  
                    result += '월 '
                break;
                case 2:  
                    result += '화 '
                break;
                case 3:  
                    result += '수 '
                break;
                case 4:  
                    result += '목 '
                break;
                case 5:  
                    result += '금 '
                break;
                case 6:  
                    result += '토 '
                break;
                case 0:  
                    result += '일 '
                break;
                default:
                    break;
            }
        }
    }
    return result;
}

function UserStatus({userData, data}){
    return (
        <div>
            <div id="userInfo" className="infoList">
                <div>{userData.user_name}</div>
                <div>성별: {userData.user_gender}</div>
                <div>나이: {userData.user_age}</div>
            </div>
            <div className="infoList">
                <h3>목표</h3>
                <div>목표 체중: {data.goal_weight}</div>
                <div>주간 목표 횟수: {data.goal_weekly}</div>
                <div>목표 요일: {refineGoals(data.goal_daily)}</div>
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

function DailyDetails({day, records, onShow}){
    const data =  records.filter(item => item.date === day);
    if (data.length > 0){
        return (
            <>
                <h2 style={{position:'absolute', top:'150px'}}>{day}</h2>
                <ExerciseBlock 
                data={data[0]}
                mode={'clickable'}/>
                <button onClick={onShow}>close</button>
            </>
        );
    }
    else{
        return (
        <>
            <h2 style={{position:'absolute', top:'150px'}}>{day}</h2>
            <h3>표시할 데이터가 없습니다.</h3>
            <button onClick={onShow}>close</button>
        </>
        );
    }
}

function SideBar({side, day, records, onDetail}){
    const [goal, setGoal] = useState({
        goal_weekly: null,
        goal_daily: [null, null, null, null, null, null, null],
        goal_daily_time: '00:00',
        goal_weight: 0,}
    );
    const [user, setUser] = useState({
        user_id: null,
        user_name: null,
        user_gender: 0,
        user_age: 0,
        user_email: null
    })

    useEffect(() => {
        fetchGoals();
        fetchUser();
    }, [])

    const fetchGoals = async () => {
        try{
            const data = await getGoal();
            setGoal(data);
        } catch (error) {
            console.error(error.message);
        }
    }
    const fetchUser = async () => {
        try{
            const data = await getUserData();
            setUser(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    function onShow(){
        onDetail(false);
    }

    return (
        (side === 'right')?(
        <div className="sidebar rightSide flex-grow-side">
            <DailyDetails 
            records={records}
            day={day}
            onShow={onShow}/>
        </div>
        ):(
        <div className="sidebar leftSide flex-grow-side">
            <UserStatus 
            userData={user}
            data={goal}
            />
        </div>
        )
    );
}

export default SideBar;