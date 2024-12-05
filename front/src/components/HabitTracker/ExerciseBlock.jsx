import react from 'react';

import '../index.css';

function Clickable({data}){
    const videoData = data.exercises || data;

    return (
      <>
        {videoData.map((item) => (
          <div id="clickBlock" className="block">
            {/* <Thumbnails video_id={item.video_id} /> */}
            <div className="space-between">
              <h3 className="simplified">{item.video_title}</h3>
              <span>
                {item.video_tag}
                <br />
              </span>
              {/* <span>{secToTime(item.video_length)}</span> */}
              {/* <span className="right-text">
                <FontAwesomeIcon icon={faHeart} />
                {item.video_likes}
                <br />
              </span> */}
            </div>
          </div>
        ))}
      </>
    );
}

function NonClickable({data}){
    return (
        <>
        {data.exercises.map((item) => (
            <div>
                <div id={item.date} className="nonclickable">
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
            data={data} />
            ):(
            <NonClickable
            data={data} />
        )
    );
}

export default ExerciseBlock;