import react, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";


function VideoLists({data}){
    // 태현님의 video 컴포넌트 사용 예정
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