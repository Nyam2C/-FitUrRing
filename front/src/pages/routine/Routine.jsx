import React, { useState, useEffect } from "react";
import "./Routine.css";
import Start from "./Start";
import Timer from "./Timer";
import Rest from "./Rest";
import List from "./List";
import Video from "./Video";
import Now from "./Now";
import Progress from "./Progress";

function Routine() {
    const [isActive, setIsActive] = useState(false); // 운동 시작 여부
    const [isPaused, setIsPaused] = useState(false); // 운동 중 정지 여부
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 운동
    const [selectedRoutine, setSelectedRoutine] = useState(null); // 선택된 루틴
    const [totalDuration, setTotalDuration] = useState(0); // 총 타이머 시간
    const [restSeconds, setRestSeconds] = useState(60); // 쉬는 시간
    const [isRest, setIsRest] = useState(false); // 휴식 상태 여부
    const [progressTimes, setProgressTimes] = useState(null);
    const [endSignal, setEndSignal] = useState(false); // 종료 여부

    /*
        START 버튼 클릭 시
    */
    const ButtonClick = () => {
        setIsActive((prev) => !prev);
        setIsPaused(false); // 시작 시 정지 상태 해제
        setCurrentIndex(0);
        setIsRest(false);
        window.open(selectedRoutine.exercises[currentIndex].link, "_blank", "noopener,noreferrer");
    };

    /*
        운동 중 Pause 버튼 클릭 시
     */
    const handlePause = () => {
        if (isActive) setIsPaused((prev) => !prev); // 정지 상태 토글
    };

    /*
        루틴 선택 시 운동 영상 재생시간 합하여 타이머에 반영
    */
    const handleRoutineSelect = (routine) => {
        setSelectedRoutine(routine);
        const totalTime = routine.exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
        setTotalDuration(totalTime + restSeconds * (routine.exercises.length - 1));
        setCurrentIndex(0);
        setIsRest(false);
    };

    /*
        운동 시 Next 클릭 시 다음 운동 영상 링크 오픈과 함께 넘어감
        휴식 시는 휴식 종료
    */
    const handleNext = () => {
        if (isPaused) return;
        if (isRest) {
            setIsRest(false);
        } else if (currentIndex < selectedRoutine.exercises.length - 1) {
            setIsRest(true);
            setCurrentIndex(currentIndex + 1);
            if (isActive) window.open(selectedRoutine.exercises[currentIndex + 1].link, "_blank", "noopener,noreferrer");

        } else {
            setEndSignal(true);
            setIsActive(false);
        }
    };

    const onendClick = () => {
        window.location.reload();
    }

    /*
        쉬는 시간 반영하여 타이머에 반영
    */
    useEffect(() => {
        if (!selectedRoutine) return;

        const totalExerciseTime = selectedRoutine.exercises.reduce(
            (sum, exercise) => sum + exercise.duration,
            0
        );

        const totalRestTime = restSeconds * (selectedRoutine.exercises.length - 1);

        setTotalDuration(totalExerciseTime + totalRestTime);
    }, [restSeconds, selectedRoutine]);

    /*
        드래그로 변경한 운동 순서 반영
    */
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
                                onPause={handlePause}
                                isPaused={isPaused}
                                onAddTime={(time) => setProgressTimes(time)}
                                endSignal={endSignal}
                            />
                        )}
                    </div>
                    <div id="rest">
                        <Rest onRestChange={setRestSeconds} isActive={isActive} />
                    </div>
                    <div id="timer">
                        <Timer
                            duration={totalDuration}
                            isActive={isActive && !isPaused}
                        />
                    </div>
                </div>
                <div id="down">
                    <div id="progress">
                        <Progress times={progressTimes} endSignal={endSignal} onendClick={onendClick} />
                    </div>
                    <div id="video">
                        {selectedRoutine && (
                            <Video
                                routine={selectedRoutine}
                                onRoutineChange={handleRoutineChange}
                                onVideoClick={(video) =>
                                    setCurrentIndex(selectedRoutine.exercises.indexOf(video))
                                }
                                isActive={isActive || isPaused}
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
