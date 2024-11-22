import react from 'react';

import './index.css';

function ExerciseBlock(props){
    return (
        <>
        {props.data.exercises.map((item) => (
            <div>
                <div className="block">
                    {item.video_title}
                </div>
            </div>
        ))}
        </>
    );
}

export default ExerciseBlock;