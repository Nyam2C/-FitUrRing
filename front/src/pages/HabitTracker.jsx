import react, { useState } from 'react';
import Calendar from '../components/Calendar';
import SideBar from '../components/SideBar';

function HabitTracker(){
    const [detail, setDetail] = useState(false);
    
    function onDetail(){
        setDetail(true);
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
                onDetail={onDetail}
                />
            </div>

            {detail && (
            <SideBar
            side={"right"} 
            onDetail={deleteDetail}/>
            )}
        </div>
    );
}

export default HabitTracker;
