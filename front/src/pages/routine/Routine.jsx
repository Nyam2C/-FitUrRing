import React, { useState } from "react";
import "./index.css";
import Start from "./Start";
import Timer from "./Timer";
import Rest from "./Rest";
import List from "./List";
import Video from "./Video";
import Now from "./Now";

function Routine() {
    const [isActive, setIsActive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0);

    const ButtonClick = () => {
        setIsActive((prev) => !prev);
    };

    // 루틴 선택 처리
    const handleRoutineSelect = (routine) => {
        setSelectedRoutine(routine);
        const totalTime = routine.exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
        setTotalDuration(totalTime);
        setCurrentIndex(0); // 루틴 선택 시 초기화
        setIsActive(false); // 루틴 선택 시 타이머 초기화
    };

    const handleNext = () => {
        if (currentIndex < selectedRoutine.exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("모든 운동이 완료되었습니다!");
        }
    };

    return (
        <div id="box">
            <div id="left">
                <div id="up">
                    <div id="now">
                        {selectedRoutine && (
                            <Now
                                currentVideo={selectedRoutine.exercises[currentIndex]}
                                onNext={handleNext}
                            />
                        )}
                    </div>
                    <div id="rest">
                        <Rest />
                    </div>
                    <div id="timer">
                        <Timer duration={totalDuration} isActive={isActive} />
                    </div>
                </div>
                <div id="down">
                    <div id="progress"></div>
                    <div id="video">
                        {selectedRoutine && (
                            <Video
                                routine={selectedRoutine}
                                onVideoClick={(video) =>
                                    setCurrentIndex(selectedRoutine.exercises.indexOf(video))
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
            <div id="right">
                <div id="list">
                    <List onRoutineSelect={handleRoutineSelect} />
                </div>
                <div id="start">
                    <Start ButtonClick={ButtonClick} isActive={isActive} />
                </div>
            </div>
        </div>
    );
}

export default Routine;
