import React from 'react';

import Thumbnails from '../Thumbnails';
import secToTime from './secToTime';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function VideoDetails({video, routines}) {
    async function addRoutine(e){
        const data = {
            routine_name : e.target.value,
            video_id : video.video_id
        }
        try{ 
            const response = await addRoutineVideo(data); 
        } catch(err) {
            alert(err.message);
        } 
    }
    
    return (
        <div className='videoDetails'>
        <Thumbnails video_id={video.video_id} video_title={video.video_title} mode="maxresdefault" />
            {/*머있어야되지,, 일단  드롭다운 메뉴에서 루틴 선택하기 루틴에 추가하는 API부르기*/}
            <div className='left-align'>
                <h2>{video.video_title}</h2>
                <span className='details'>{video.channel_title}</span>
                <span className='details'>{video.video_tag}<br/></span>
                <span className='details right-text'>
                    <span>{secToTime(video.video_length)}</span> 
                    <span><FontAwesomeIcon icon={faHeart} /> {video.video_likes}<br/></span>
                </span>
                <select name="routines" id="routines">
                {routines.map((item) => (
                    <>
                    <option value={item}>{item}</option>
                    <option value="javascript">JavaScript</option>
                    <option value="php">PHP</option>
                    <option value="java">Java</option>
                    <option value="golang">Golang</option>
                    <option value="python">Python</option>
                    <option value="c#">C#</option>
                    <option value="C++">C++</option>
                    <option value="erlang">Erlang</option>
                    </>
                ))}
                </select>
                <button className="addbutton" onClick={addRoutine}>추가</button>
            </div>
        </div>
    );
}

export default VideoDetails;