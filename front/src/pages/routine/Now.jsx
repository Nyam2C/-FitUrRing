import React, { useState, useEffect} from 'react';
import "./Now.css";

function Now({ currentVideo, onNext, isRest, restSeconds, isActive, onPause, isPaused }) {
    const [exerciseTime, setExerciseTime] = useState(0); // 현재 운동 타이머
    const [restTime, setRestTime] = useState(0); // 현재 휴식 타이머
    const [restTimeLeft, setRestTimeLeft] = useState(restSeconds); // 휴식 타이머
    const [isTakingBreak, setIsTakingBreak] = useState(false); // 휴식 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isActive) setRestTimeLeft(restSeconds);
    }, [restTimeLeft]);

    useEffect(() => {
        if (isRest || isPaused || !isActive || isTakingBreak) return;

        const timer = setInterval(() => {
            setExerciseTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRest, isPaused, isActive, isTakingBreak]);

    useEffect(() => {
        if (!isTakingBreak) return;

        const timer = setInterval(() => {
            setRestTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isTakingBreak]);

    useEffect(() => {
        if (!isRest || isPaused || !isActive || isTakingBreak) return;

        const timer = setInterval(() => {
            setRestTimeLeft((prev) => {
                if (prev <= 1){
                    onNext();
                }
                if (prev <= 4) {
                    setIsModalOpen(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRest, isPaused, isActive, isTakingBreak]);

    useEffect(() => {
        if (currentVideo && !isRest && isActive) {
            setIsModalOpen(false);
            alert(restTimeLeft);
            setExerciseTime(0);
            setRestTimeLeft(restSeconds);
            window.open(currentVideo.link, "_blank", "noopener,noreferrer");
        }
    }, [currentVideo, isRest, isActive]);

    const handleRestStart = () => {
        setIsTakingBreak(true);
    };

    const handleRestStop = () => {
        setIsTakingBreak(false); // 휴식 상태 비활성화
        setRestTime(0); // 휴식 타이머 초기화
    };

    const handleRestNext = () => {
        setRestTimeLeft(4);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className={`now-container ${isRest ? "rest-highlight" : ""}`}>
            {isTakingBreak ? (
                <div className="now-break">
                    <p>Taking a Break</p>
                    <h3>{formatTime(restTime)}</h3>
                    <button className="stop-rest-button" onClick={handleRestStop}>
                        Resume Exercise
                    </button>
                </div>
            ) : isRest ? (
                <div className="now-rest">
                    <p>Rest Period</p>
                    {!isModalOpen ? (
                        <h3>{formatTime(restTimeLeft)}</h3>
                    ) : (
                        <h3>다음 운동으로</h3>

                    )
                    }
                    <button className="next-button" onClick={handleRestNext}>
                        Next
                    </button>
                    {isModalOpen && (
                        <div className="modal-backdrop">
                            <div className="modal">
                                <div className="modal-content">
                                    <p>{restTimeLeft}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="now-container">
                    {currentVideo?.thumbnail && (
                        <div className="now-thumbnail">
                            <img
                                src={currentVideo.thumbnail}
                                alt={currentVideo.title}
                                className="now-thumbnail"
                            />
                            <p className="now-title">{currentVideo.title}</p>
                        </div>
                    )}
                    <span>Exercise Timer: {formatTime(exerciseTime)}</span>
                    <div className="underbar">
                        <button className="next-button" onClick={onNext}>
                            Next
                        </button>
                        <button className="pause-button" onClick={onPause}>
                            {isPaused ? "Start" : "Pause"}
                        </button>
                        <button className="rest-button" onClick={handleRestStart}>
                            Rest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Now;
