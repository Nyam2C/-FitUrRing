import react from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";


import './index.css';  
import Thumbnails from './Thumbnails';
function secToTime(time){
    let mins = Math.floor(parseInt(time) / 60);
    const secs = parseInt(time) % 60;
    if (mins>60){
        const hrs = Math.floor(mins/60);
        mins = mins%60;
        return  `${hrs}:${mins}:${secs}`;
    }
    return `${mins}:${secs}`;
}

function handleClick(){
    //모달창 띄워서 video의 data보여주기
    return 0;
}

function Clickable({data, onClick}){
    console.log(data);
    return (
        <>
        {data.map((item) => (
            <div>
                <div id="clickBlock" className="block">
                    <Thumbnails video_id={item.video_id} />
                    <div className='space-between'>
                        <h3 className="simplified">{item.video_title}</h3>
                        <span>{item.video_tag}<br/></span>
                        <span>{secToTime(item.video_length)}</span>
                        <span className='right-text'> <FontAwesomeIcon icon={faHeart} />
                        {item.video_likes}<br/></span>
                    </div>
                </div>
            </div>
        ))}
        </>
    );
}

function NonClickable({data}){
    return (
        <>
        {data.map((item) => (
            <div>
                <div className="block">
                    {item.video_title}
                </div>
            </div>
        ))}
        </>
    );
}


function ExerciseBlock({data, mode}){
    return (
        (mode === 'clickable')?(
            <Clickable 
            data={data}
            onClick={handleClick} />
            ):(
            <NonClickable
            data={data} />
        )
    );
}

export default ExerciseBlock;
