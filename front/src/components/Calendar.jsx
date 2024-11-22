import react, { useState, useEffect } from 'react';

import Day from './Day.jsx';
import './index.css';

const period_start = '2024-10-01';
const period_end = '2024-10-31;'

    const data = [
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
        },
    { 
        date: '2024-11-08',
        exercises: [{
        video_title: 'workout2',
        video_tag: 'neck',
        video_time: '7:55'
        },],
    },
    { 
        date: '2024-11-11',
        exercises: [{
        video_title: 'workout1',
        video_tag: 'head',
        video_time: '10:49'
        },],
    },
    { 
        date: '2024-11-27',
        exercises: [{
        video_title: 'workout3',
        video_tag: 'foot',
        video_time: '20:04'
        },],
    },
];

const dateFormat = (date) => {
    let year = parseInt(date.getFullYear());
    let month = parseInt(date.getMonth()+1);
    month = (month<10)?`0${month}`:`${month}`;
    let day = parseInt(date.getDate());
    day  = (day<10)?`0${day}`:`${day}`

    return `${year}-${month}-${day}`
};

function Calendar(props){
    const [today, setToday] = useState(new Date());

    function onPrev(){
        const newMonth = today.getMonth() - 1;
        setToday(new Date(today.getFullYear(), newMonth));
    }
    function onNext(){
        const newMonth = today.getMonth() + 1;
        setToday(new Date(today.getFullYear(), newMonth));
    }

    let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let endOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);

    let i = 0, j = 0;
    let cur = new Date(startOfMonth);
    const fullData = [];

    while (cur <= endOfMonth){
        if (j < startOfMonth.getDay()){
            const temp = { date: null };
            fullData.push(temp);
            j++
            continue;   
        }
        if (i < data.length && dateFormat(cur) === data[i].date){
            fullData.push(data[i]);
            i++
        }
        else{   
            const temp = { date: dateFormat(cur) };
            fullData.push(temp);
        }
        cur.setDate(cur.getDate()+1);
    }
    
    return (
        <>
            <div className="row">
                <button onClick={onPrev}>prev</button>
                <h1 className="title">{dateFormat(today).slice(0,7)}</h1>
                <button onClick={onNext}>next</button>
            </div>

            <div className="grid">
                    <div className="center">일</div>
                    <div className="center">월</div>
                    <div className="center">화</div>
                    <div className="center">수</div>
                    <div className="center">목</div>
                    <div className="center">금</div>
                    <div className="center">토</div>
            </div>
            <div className="grid">
                <Day 
                mode={"list"}
                data={fullData}
                onDetail={props.onDetail} />
            </div>
        </>
    );
}

export default Calendar;