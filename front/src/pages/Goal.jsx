import react, { useState } from 'react';

function Goal(){
    const [weight, setWeight] = useState();
    const [mon, setMon] = useState(false);
    const [tue, setTue] = useState(false);
    const [wed, setWed] = useState(false);
    const [thu, setThu] = useState(false);
    const [fri, setFri] = useState(false);
    const [sat, setSat] = useState(false);
    const [sun, setSun] = useState(false);
    const [dailyTime, setDailyTime] = useState();
    const [weeklyTime, setWeeklyTime] = useState();

    function handleClick(e){
        //월 화 수 목 금 토 일 버튼 -> 클릭하면 색 바뀜, 저장하면 해당 요일에 운동하겠다는 목표 설정
        //달력에 목표한 요일만 색을 다르게 표시
        e.preventDefault();
        e.target.style.backgroundColor = "#333333"; 
    
        const target = e.target.id;
        switch(target) {
            case 'Mon':  
                (mon === false)?setMon(true):setMon(false);
                break;      
            case 'Tue':  
                (tue === false)?setTue(true):setTue(false);
                break;
            case 'Wed':  
                (wed === false)?setWed(true):setWed(false);
                break;
            case 'Thu':  
                (thu === false)?setThu(true):setThu(false);
                break;
            case 'Fri':  
                (fri === false)?setFri(true):setFri(false);
                break;
            case 'Sat':  
                (sat === false)?setSat(true):setSat(false);
                break;
            case 'Sun':  
                (sun === false)?setSun(true):setSun(false);
                break;
            default:
              break;
          }
    }

    return (
        <div>
            <form id="GoalForm">
                <label id="title">목표 설정</label>
                <label>목표 체중</label>
                <input id="weight" type="number" name="weight" placeholder={weight}></input>

                <div className="row">
                    <button id="Sun" onClick={handleClick}> 일 </button>
                    <button id="Mon" onClick={handleClick}> 월 </button>
                    <button id="Tue" onClick={handleClick}> 화 </button>
                    <button id="Wed" onClick={handleClick}> 수 </button>
                    <button id="Thu" onClick={handleClick}> 목 </button>
                    <button id="Fri" onClick={handleClick}> 금 </button>
                    <button id="Sat" onClick={handleClick}> 토 </button>
                </div>
                <label>일일 목표 운동 시간</label>
                <input  id="DailyTime" type="text" name="DailyTime" placeholder={dailyTime}></input>
                
                <label>주간 목표 운동 시간</label>
                <input  id="weeklyTime" type="text" name="weeklyTime" placeholder={weeklyTime}></input>

                <button type="submit">저장</button>
            </form>
        </div>
    );
}

export default Goal;