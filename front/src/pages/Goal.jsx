import react, { useState, useEffect } from 'react';

import SideBar from '../components/SideBar';
import { getGoal, addGoal } from '../api.js';

function Goal(){
    const [goal, setGoal] = useState([]);
    const [weight, setWeight] = useState();
    const [mon, setMon] = useState(false);
    const [tue, setTue] = useState(false);
    const [wed, setWed] = useState(false);
    const [thu, setThu] = useState(false);
    const [fri, setFri] = useState(false);
    const [sat, setSat] = useState(false);
    const [sun, setSun] = useState(false);
    const [dailyTime, setDailyTime] = useState();
    const [weeklyCount, setWeeklyCount] = useState(0);

    useEffect(() => {
        setWeeklyCount(mon+tue+wed+thu+fri+sat+sun);
    }, [mon, tue, wed, thu, fri, sat, sun]);

    useEffect(() => {
        fetchGoals();
    }, [])

    const fetchGoals = async () => {
        try{
            const data = await getGoal();
            setWeight(data.goal_weight);
            setDailyTime(data.goal_daily_time);
            setSun(data.goal_daily[0]);
            setMon(data.goal_daily[1]);
            setTue(data.goal_daily[2]);
            setWed(data.goal_daily[3]);
            setThu(data.goal_daily[4]);
            setFri(data.goal_daily[5]);
            setSat(data.goal_daily[6]);
            setWeeklyCount(data.goal_weekly);
        } catch (error) {
            console.error(error.message);
        }
    }
    function handleDTChange(e){
        const newvalue = e.target.value;
        if (newvalue.indexOf(":") === -1){
            alert("분:초 단위로 입력해주세요");
            return;
        }
        setDailyTime(e.target.value);
    }
    function handleWeightChange(e){
        setWeight(e.target.value);
    }
    function handleClick(e){
        e.preventDefault();
        console.log(e);

        const target = e.target.id;
        switch(target) {
            case 'Mon':  
                setMon(prev => !prev);
                break;      
            case 'Tue':  
                setTue(prev => !prev);
                break;
            case 'Wed':  
                setWed(prev => !prev);
                break;
            case 'Thu':  
                setThu(prev => !prev);
                break;
            case 'Fri':  
                setFri(prev => !prev);
                break;
            case 'Sat':  
                setSat(prev => !prev);
                break;
            case 'Sun':  
                setSun(prev => !prev);
                break;
            default:
                break;
          }
        }
    function handleSubmit(e){
        e.preventDefault();
        const data = {
                goal_weekly: weeklyCount,
                goal_daily: [sun, mon, tue, wed, thu, fri, sat],
                goal_daily_time: dailyTime,
                goal_weight: weight
        }
        addGoal(data);
    }
    return (
        <div className='row flex'>
            <SideBar 
            side={"left"}
            />

            <form id="GoalForm" className='flex-grow-main' onSubmit={handleSubmit}>
                <label id="title">목표 설정</label>
                <label>목표 체중</label>
                <input id="weight" type="number" name="goal_weight" onChange={handleWeightChange} value={weight}></input>

                <div className="row" >
                    <button id="Sun" className="circle" onClick={handleClick} 
                    style={{backgroundColor:(sun)?'#333333':null}}> 일 </button>
                    <button id="Mon" className="circle" onClick={handleClick}
                     style={{backgroundColor:(mon)?'#333333':null}}> 월 </button>
                    <button id="Tue" className="circle" onClick={handleClick}
                     style={{backgroundColor:(tue)?'#333333':null}}> 화 </button>
                    <button id="Wed" className="circle" onClick={handleClick}
                     style={{backgroundColor:(wed)?'#333333':null}}> 수 </button>
                    <button id="Thu" className="circle" onClick={handleClick}
                     style={{backgroundColor:(thu)?'#333333':null}}> 목 </button>
                    <button id="Fri" className="circle" onClick={handleClick}
                     style={{backgroundColor:(fri)?'#333333':null}}> 금 </button>
                    <button id="Sat" className="circle" onClick={handleClick}
                     style={{backgroundColor:(sat)?'#333333':null}}> 토 </button>
                </div>
                <label>일일 목표 운동 시간</label>
                <input  id="DailyTime" type="text" name="goal_daily_time" onChange={handleDTChange} value={dailyTime}></input>
                
                <label>주간 목표 횟수</label>
                <input  id="weeklyCount" type="text" name="goal_weekly" value={weeklyCount}></input>

                <button type="submit">저장</button>
            </form>
        </div>
    );
}

export default Goal;