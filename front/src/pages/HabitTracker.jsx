import react, { useState } from 'react';
import Calendar from '../components/Calendar';
import SideBar from '../components/SideBar';

function HabitTracker(){
    const [detail, setDetail] = useState();
    
    function onDetail(){

    }
    return (
        <div >
            <SideBar 
            side={"left"}/>
            <div className="withBar padding">
                <Calendar />
            </div>
            <SideBar
            onDetail={onDetail}
            side={"right"} />
        </div>
    );
}

export default HabitTracker;
