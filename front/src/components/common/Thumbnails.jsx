import react from 'react';

function Thumbnails({video_id, video_title, mode}){
    return (
        <img className={`thumbnails-${mode}`} src={`https://img.youtube.com/vi/${video_id}/${mode}.jpg`} alt={video_title}/>
    )
}

export default Thumbnails;