import react from 'react';

function Thumbnails({video_id, video_title}){
    return (
        <img className="thumbnails" src={`https://img.youtube.com/vi/${video_id}/mqdefault.jpg`} alt={video_title}/>
    )
}

export default Thumbnails;