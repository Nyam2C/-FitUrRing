import react, { useState, useEffect } from 'react';

import Day from './Day.jsx';
import './index.css';
import { getMonthlyRecord } from '../api.js';



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
    const [view, setView] = useState('ring');
    const [records, setRecords] = useState({});

    useEffect(() => {
        fetchMonthlyRecords();
    }, [])
    const fetchMonthlyRecords = async () => {
        try{
            const data = await getMonthlyRecord();
            setRecords(data);
        } catch (error) {
            console.error(error.message);
        }
    }


    function onPrev(){
        const newMonth = today.getMonth() - 1;
        setToday(new Date(today.getFullYear(), newMonth));
    }
    function onNext(){
        const newMonth = today.getMonth() + 1;
        setToday(new Date(today.getFullYear(), newMonth));
    }
    function handleView(){
        setView((prev) => ((prev==='ring')?'list':'ring'));
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
        if (i < records.length && dateFormat(cur) === records[i].date){
            fullData.push(records[i]);
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
            <div className="flex-right">
                <button onClick={handleView}>toggle</button>
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
                mode={view}
                data={fullData}
                onDetail={props.onDetail} />
            </div>
        </>
    );
}

export default Calendar;