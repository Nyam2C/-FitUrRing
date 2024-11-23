import react, { useState } from 'react';

import './index.css';

function calculPercent(data, goal){
    if (goal){
        //초단위로 정제해야됨..        
    }
    let total = 0;
    for (let i=0; i<data.exercises.length; i++){
            let time = data.exercises[i].video_time;
            let min = parseInt(time.slice(0,time.indexOf(':')));
            let sec = parseInt(time.slice(time.indexOf(':')+1));
            total += (min*60+sec);
        }
    //const percent = total / (parseInt(goal.slice(0,goal.indexOf(':'))))*60 + parseInt(goal.slice(goal.indexOf(':')));
    const percent = (total/goal).toFixed(2);
    return percent;
}


function Ring({data, goal}){
    const percent = calculPercent(data, goal);
    const dasharray = [2*Math.PI*10];

    return (
        <div className="center">
            <svg width="10vh" heigth="10vh" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="10" fill="none" 
                        stroke='#CFFF5E' stroke-width="6" 
                        strokeDasharray={dasharray}
                        strokeDashoffset={2*Math.PI*10 * (1-percent)}
                        stroke-linecap="round"
                        transform="rotate(-90) translate(-30)"/>
            </svg>
        </div>
    );
}

export default Ring;