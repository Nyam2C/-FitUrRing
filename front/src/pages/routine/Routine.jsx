import React, { useEffect, useState } from 'react';
import './index.css';
import Start from './Start'
import Timer from './Timer'
import Rest from './Rest'
import List from './List'
import Video from './Video'
import Now from './Now'



function Routine() {
    const [isActive, setIsActive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const ButtonClick = () => {
        setIsActive((prev) => !prev);
    };

    const routine = {
        name: "상체 루틴",
        exercises: [
            {
                title: "기구 없이 하는 등 운동",
                thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1",
                link: "https://www.youtube.com/watch?v=example1",
            },
            {
                title: "푸쉬업",
                thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2",
                link: "https://www.youtube.com/watch?v=example2",
            },
            {
                title: "데드리프트",
                thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3",
                link: "https://www.youtube.com/watch?v=example3",
            },
            {
                title: "풀업",
                thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4",
                link: "https://www.youtube.com/watch?v=example4",
            },
        ],
    };

    const currentVideo = routine.exercises[currentIndex];

    const handleNext = () => {
        if (currentIndex < routine.exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("모든 운동이 완료되었습니다!");
        }
    };

    return (
        <div id="box">
            <div id="left">
                <div id="up">
                    <div id='now'>
                        <Now currentVideo={currentVideo} onNext={handleNext} />
                    </div>
                    <div id='rest'>
                        <Rest />
                    </div>
                    <div id='timer'>
                        <Timer duration={5} isActive={isActive} />
                    </div>
                </div>
                <div id="down">
                    <div id='progress'>
                    </div>
                    <div id='video'>
                        <Video routine={routine} onVideoClick={(video) => setCurrentIndex(routine.exercises.indexOf(video))} />
                    </div>
                </div>
            </div>
            <div id="right">
                <div id='list'>
                    <List />
                </div>
                <div id='start'>
                    <Start ButtonClick={ButtonClick} isActive={isActive} />
                </div>
            </div>
        </div>
    );
}

export default Routine;