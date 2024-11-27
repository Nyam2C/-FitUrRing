import react, { useState, useEffect } from 'react';

import './index.css';
import Ring from './Ring';
import ExerciseBlock from './ExerciseBlock';
import { getGoal } from '../api';

function displayWhat(item, mode, goal, doit){
    console.log(item, doit);
    if (!item.date)             
        return <></>;
    else if (!item.exercises)
        return (
            <div className={`DateCell ${doit}`}>
                <span className="center">{item.date.substr(8,2)}</span>
            </div>
        );
    else if (item.date && item.exercises){
        if (mode === 'ring')
            return (
                <div className={`DateCell ${doit}`}>
                    <span className="center">{item.date.substr(8,2)}</span>
                    <Ring
                    data={item}
                    goal={goal} />
                </div>
            );
        else if (mode === 'list')
            return (
                <div className={`DateCell ${doit}`}>
                    <span className="center">{item.date.substr(8,2)}</span>
                    <ExerciseBlock
                    data={item} />
                </div>
            );
        else    return(
                <div>
                    <span>표시할 정보가 없습니다.</span>
                </div>
        );
    }
    else    return(
            <div>
                <span>표시할 정보가 없습니다.</span>
            </div>
    );
}

function getMax(data){
    let max = 0;
    for (let i=0; i<data.length; i++){
        if (!data[i].exercises) continue;
        let total = 0;
        for (let j=0; j<data[i].exercises.length; j++){
            let time = data[i].exercises[j].video_time;
            let min = parseInt(time.slice(0,time.indexOf(':')));
            let sec = parseInt(time.slice(time.indexOf(':')+1));
            total += (min*60+sec);
        }
        max = (max < total)? total : max;
    }
    console.log(max);
    return max;
}

function Day({data, mode, onDetail}){
    const [goal, setGoal] = useState({
        goal_weekly: null,
        goal_daily: [null, null, null, null, null, null, null],
        goal_daily_time: '00:00',
        goal_weight: null,}
    );

    useEffect(() => {
        fetchGoals();
    }, [])

    const fetchGoals = async () => {
        try{
            const data = await getGoal();
            setGoal(data);
        } catch (error) {
            console.error(error.message);
        }
    }
    const doit = (index) => ((goal.goal_daily[index%7]) ? 'doit' : null);

    let goalTime = goal.goal_daily_time;
    if (typeof goalTime === 'string'){
        let total = 0;
        let min = parseInt(goalTime.slice(0,goalTime.indexOf(':')));
        let sec = parseInt(goalTime.slice(goalTime.indexOf(':')+1));
        total += (min*60+sec);
        goalTime = total;
    }
    if (mode === 'ring' && goalTime === null){
        goalTime = getMax(data);  
    }

    function onShow(e){
        onDetail(true);
    }

    return (
        <>
        {data.map((item, index) => (
            <div onClick={onShow}>
                {displayWhat(item, mode, goalTime, doit(index))}
            </div>
        ))}
        </>
    );
}

export default Day;