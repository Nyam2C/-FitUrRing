import react from 'react';

function Thumbnails({video_id, video_title, mode}){
    function handleClick(){
        const url = `https://youtu.be/${video_id}`;
        window.open(url, '_blank', 'noopener noreferrer');
    }
    return (
        <img onClick={handleClick} className={`thumbnails-${mode}`} src={`https://img.youtube.com/vi/${video_id}/${mode}.jpg`} alt={video_title}/>
    )
}

export default Thumbnails;