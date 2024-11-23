import react from 'react';

import './index.css';

function Clickable({data}){
    return (
        <>
        {data.exercises.map((item) => (
            <div>
                <div className="block">
                    {item.video_title}
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
            data={data} />
            ):(
            <NonClickable
            data={data} />
        )
    );
}

export default ExerciseBlock;