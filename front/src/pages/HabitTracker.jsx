import react, { useState, useEffect } from 'react';
import Calendar from '../components/HabitTracker/Calendar';
import SideBar from '../components/HabitTracker/SideBar';
import { getMonthlyRecord } from '../api/HabitTrackerAPI'


function HabitTracker(){
    const [detail, setDetail] = useState(false);
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
    
    function onDetail(e){
        setDetail(e);
    }
    function deleteDetail(){
        setDetail(false);
    }
    function userStatus(){
        
    }

    return (
        <div className="flex">
            <SideBar 
            side={"left"}/>

            <div className={`flex-grow-main `}>
                <Calendar 
                records={records}
                onDetail={onDetail}
                />
            </div>

            {detail && (
            <SideBar
            side={"right"} 
            records={records}
            day={detail}
            onDetail={deleteDetail}/>
            )}
        </div>
    );
}

export default HabitTracker;
