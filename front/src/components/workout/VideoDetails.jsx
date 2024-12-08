import React from 'react';

import Thumbnails from '../common/Thumbnails';
import secToTime from './secToTime';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {addRoutineVideo} from '../../api/routineAPI';

function VideoDetails({video, routines}) {
    async function addRoutine(e){
        const data = {
            routine_name: e.target.value,
            video_id: video.video_id
        }
        try{ 
            const response = await addRoutineVideo(data);
            if (response) {
                alert("루틴에 성공적으로 추가되었습니다.");
            }
        } catch(err) {
            console.error("루틴 추가 실패:", err);
            alert(err.message || "루틴 추가에 실패했습니다.");
        } 
    }
    
    return (
        <div className='videoDetails'>
        <Thumbnails video_id={video.video_id} video_title={video.video_title} mode="maxresdefault" />
            <div className='left-align'>
                <h2>{video.video_title}</h2>
                <span className='details'>{video.channel_title}</span>
                <span className='details'>{video.video_tag}<br/></span>
                <span className='details right-text'>
                    <span>{secToTime(video.video_length)}</span> 
                    <span><FontAwesomeIcon icon={faHeart} /> {video.video_likes}<br/></span>
                </span>
                {routines ? (
                    <>
                <select>
                    {routines.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                    ))}
                </select>
                <button className="addbutton" onClick={addRoutine}>추가</button>
                </>
                ) : (
                <label>추가할 루틴이 없습니다.</label>
                )}
            </div>
        </div>
    );
}

export default VideoDetails;