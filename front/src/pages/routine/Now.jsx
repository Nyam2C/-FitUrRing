import React, { useState, useEffect } from 'react';
import "./Now.css";

function Now({
    currentVideo,
    onNext,
    isRest,
    restSeconds,
    isActive,
    onPause,
    isPaused,
    onAddTime, 
    endSignal
}) {
    const [exerciseTime, setExerciseTime] = useState(0); // 현재 운동 타이머
    const [restTime, setRestTime] = useState(0); // 현재 휴식 타이머
    const [restTimeLeft, setRestTimeLeft] = useState(restSeconds); // 휴식 타이머
    const [isTakingBreak, setIsTakingBreak] = useState(false); // 휴식 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFlag, setFlag] = useState(true);

    useEffect(() => {
        if (!isActive) setRestTimeLeft(restSeconds);
    }, [restTimeLeft]);

    useEffect(() => {
        if (endSignal&&!isFlag){
            onAddTime(`Exercise: ${exerciseTime}`);
            setFlag(true);
        }
    }, [exerciseTime]);

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
                if (prev <= 1) {
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
        if (currentVideo && isRest && isActive) {
            setIsModalOpen(false);
            onAddTime(`Exercise: ${exerciseTime}`);
            setExerciseTime(0);
            setRestTimeLeft(restSeconds);
        } else if (!isRest && !isFlag && isActive) onAddTime(`Rest: ${restSeconds}`);
        else if (!isRest && isFlag && isActive) setFlag(false);
    }, [currentVideo, isRest, isActive]);

    const handleRestStart = () => {
        if (!isPaused && isActive) setIsTakingBreak(true);
    };

    const handleRestStop = () => {
        setIsTakingBreak(false); // 휴식 상태 비활성화
        onAddTime(`Rest: ${restTime}`);
        setRestTime(0); // 휴식 타이머 초기화
    };

    const handleRestNext = () => {
        if (isActive) {
            onAddTime(`Rest: ${restSeconds - restTimeLeft}`);
            setFlag(true);
            setRestTimeLeft(4);
        } else onNext();
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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
                    )}
                    <button className="next-button" onClick={handleRestNext}>
                        Next
                    </button>
                    {isModalOpen && (
                        <div className="modal-backdrop">
                            <div className="modal">
                                <div id="modal-content">
                                    <span>{restTimeLeft}</span>
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
                            <p className="now-title">{truncateText(currentVideo.title, 20)}</p>
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
