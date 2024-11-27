import React, { useState, useEffect } from "react";
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
    const [restSeconds, setRestSeconds] = useState(60); // 기본 휴식 시간 설정
    const [isRest, setIsRest] = useState(false); // 휴식 상태 추가

    const ButtonClick = () => {
        setIsActive((prev) => !prev);
        setCurrentIndex(0);
        setIsRest(false);
    };

    const handleRoutineSelect = (routine) => {
        setSelectedRoutine(routine);
        const totalTime = routine.exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
        setTotalDuration(totalTime + restSeconds * (routine.exercises.length - 1));
        setCurrentIndex(0);
        setIsRest(false); // 초기화 시 휴식 상태 리셋
    };

    const handleNext = () => {
        if (isRest) {
            setIsRest(false);
        } else if (currentIndex < selectedRoutine.exercises.length - 1) {
            setIsRest(true);
            setCurrentIndex(currentIndex + 1);
        } else {
            alert("모든 운동이 완료되었습니다!");
        }
    };

    useEffect(() => {
        if (!selectedRoutine) return;

        const totalExerciseTime = selectedRoutine.exercises.reduce(
            (sum, exercise) => sum + exercise.duration,
            0
        );

        const totalRestTime = restSeconds * (selectedRoutine.exercises.length - 1);

        setTotalDuration(totalExerciseTime + totalRestTime);
    }, [restSeconds, selectedRoutine]);

    const handleRoutineChange = (updatedExercises) => {
        setSelectedRoutine({ ...selectedRoutine, exercises: updatedExercises });
    };

    return (
        <div id="box">
            <div id="left">
                <div id="up">
                    <div id="now">
                        {selectedRoutine && (
                            <Now
                                currentVideo={selectedRoutine.exercises[currentIndex]}
                                isRest={isRest}
                                restSeconds={restSeconds}
                                onNext={handleNext}
                                isActive={isActive}
                            />
                        )}
                    </div>
                    <div id="rest">
                        <Rest onRestChange={setRestSeconds} isActive={isActive} />
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
                                onRoutineChange={handleRoutineChange}
                                onVideoClick={(video) =>
                                    setCurrentIndex(selectedRoutine.exercises.indexOf(video))
                                }
                                isActive={isActive}
                                currentIndex={currentIndex}
                                isRest={isRest}
                                restSeconds={restSeconds}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div id="right">
                <div id="list">
                    <List onRoutineSelect={handleRoutineSelect} isActive={isActive} />
                </div>
                <div id="start">
                    <Start
                        ButtonClick={ButtonClick}
                        isActive={isActive}
                        hasRoutine={selectedRoutine !== null}
                    />
                </div>
            </div>
        </div>
    );
}

export default Routine;
