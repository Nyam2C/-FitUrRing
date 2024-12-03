import react, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function VideoLists({data}){
    return (
        <div id="videoLists">
            {data.map((item) => (
                <div id="videoBlock">
                    <h3>{item.video_title}</h3>
                    <p>{item.by}</p>
                    <p className='flex-end'>
                    <FontAwesomeIcon icon={faHeart} />
                    {' '+item.liked}</p>
                </div>
            ))}
        </div>
    );
}
export default VideoLists;