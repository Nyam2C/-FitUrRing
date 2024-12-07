import react, {useState} from 'react';

import VideoDetails from './workout/VideoDetails';
import Modal from '../components/common/Modal';
import secToTime from './workout/secToTime';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";


import './index.css';  
import Thumbnails from './Thumbnails';

function handleClick(e, item, onClick) {
    console.log(e); // 클릭 이벤트 로그
    onClick(item); // 부모로 데이터 전달
}

function Clickable({data, onClick}){
    console.log(data);
    return (
        <>
        {data.map((item) => (
            <div>
                <div id="clickBlock" className="block" onClick={(e) => onClick(item)}>
                    <Thumbnails video_id={item.video_id} video_title={item.video_title} mode="mqdefault"/>
                    <div className='space-between'>
                        <h3 className="simplified">{item.video_title}</h3>
                        <span className='simplified'>{item.channel_title}</span>
                        <span>{item.video_tag}<br/></span>
                        <span className='right-text'>
                            <span>{secToTime(item.video_length)}</span> 
                            <span><FontAwesomeIcon icon={faHeart} /> {item.video_likes}<br/></span>
                        </span>
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


function ExerciseBlock({data, mode, routines}){
    const [showModal, setShowModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleVideoClick = (video) => {   
        setSelectedVideo(video); 
        setShowModal(true);
    };

    return (
        <>
        {(mode === 'clickable')?(
            <Clickable 
            data={data}
            onClick={handleVideoClick}/>
            ):(
            <NonClickable
            data={data} />
        )}

        {showModal && 
                <Modal width="80vw" height="80vh">
                    <div style={{ position: 'relative', padding: '20px' }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                right: '-30px',
                                top: '-80px',
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                        <VideoDetails video={selectedVideo} routines={routines}/>
                    </div>
                </Modal>
            }
        </>
    );
}

export default ExerciseBlock;
