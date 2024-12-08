import React, { useState, useEffect } from 'react';
import "./Now.css";
import truncateText from './truncateText';
import formatTime from "./formatTime"

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
    const [restTime, setRestTime] = useState(0); // 운동 중 휴식 타이머
    const [restTimeLeft, setRestTimeLeft] = useState(restSeconds); // 현재 휴식 타이머
    const [isTakingBreak, setIsTakingBreak] = useState(false); // 운동 중 휴식 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 여부
    const [isFlag, setFlag] = useState(true);
    const [oneRest, setoneRest] = useState(false);

    /*
        운동 시작 전 설정한 휴식 시간으로 타이머 시간 설정
    */
    useEffect(() => {
        if (!isActive) setRestTimeLeft(restSeconds);
    }, [restTimeLeft]);

    /*
        마지막 운동에 대한 시간 전달
    */
    useEffect(() => {
        if (endSignal) {
            onAddTime(`Exercise: ${exerciseTime}`);
        }
    }, [exerciseTime,endSignal]);

    /*
        운동 시간 타이머
    */
    useEffect(() => {
        if (isRest || isPaused || !isActive || isTakingBreak) return;

        const timer = setInterval(() => {
            setExerciseTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRest, isPaused, isActive, isTakingBreak]);

    /*
        운동 중 쉬는 시간 타이머
    */
    useEffect(() => {
        if (!isTakingBreak) return;

        const timer = setInterval(() => {
            setRestTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isTakingBreak]);

    /*
        쉬는 시간 타이머
        4초 남을 시 모달 오픈 1초 남을 시 다음 운동으로 넘어감
    */
    useEffect(() => {
        if (!isRest || isPaused || !isActive || isTakingBreak) return;

        const timer = setInterval(() => {
            setRestTimeLeft((prev) => {
                if (prev <= 1) {
                    onNext();
                    if (!isRest && !isFlag && isActive) {
                        onAddTime(`Rest: ${restSeconds}`);
                    } else if (!isRest && isFlag && isActive) setFlag(false);
                    setoneRest(false);
                }
                if (prev <= 4) {
                    setIsModalOpen(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRest, isPaused, isActive, isTakingBreak]);

    /*
        다음 운동으로 넘어 갈 시 운동 시간 전달
        휴식 종료시 쉬는 시간 전달
        마지막 조건 문은 휴식 시간에 Next 선택을 위한 조건처리 
    */
    useEffect(() => {
        if (currentVideo && isRest && isActive) {
            setIsModalOpen(false);
            onAddTime(`Exercise: ${exerciseTime}`);
            setExerciseTime(0);
            setRestTimeLeft(restSeconds);
        }
    }, [currentVideo, isRest, isActive]);

    const handleRestStart = () => {
        if (!isPaused && isActive && !oneRest) {
            setIsTakingBreak(true);
            setoneRest(true);
        }
    };

    const handleRestStop = () => {
        if (isTakingBreak) {
            setIsTakingBreak(false);
            onAddTime(`Rest: ${restTime}`);
            setRestTime(0);
        }
    };

    /*
        휴식 때 Next 클릭시 쉬는 시간 전달 및 쉬는 시간 4초로 변경
        운동 시작 전이면 그냥 다음 영상으로 넘김
    */
    const handleRestNext = () => {
        if (isActive) {
            onAddTime(`Rest: ${restSeconds - restTimeLeft}`);
            setFlag(true);
            setRestTimeLeft(4);
        } else onNext();
    };

    return (
        <div className='now-container'>
            {isTakingBreak ? (
                <div>
                    <div className='now-content'>
                        <span>Taking a Break / </span>
                        <span> / {formatTime(restTime)}</span>
                    </div>
                    <div className="underbar">
                        <button onClick={handleRestStop}>
                            Go back
                        </button>
                    </div>
                </div>
            ) : isRest ? (
                <div>
                    <div className='now-content'>
                        <span>Rest Period / </span>
                        {!isModalOpen ? (
                            <span>/ {formatTime(restTimeLeft)}</span>
                        ) : (
                            <span>/ 다음 운동으로</span>
                        )}
                    </div>
                    <div className="underbar">
                        <button className="next-button" onClick={handleRestNext}>
                            Next
                        </button>
                    </div>
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
                <div>
                    <div className='now-content'>
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
                        <p>Timer: {formatTime(exerciseTime)}</p>
                    </div>
                    <div className="underbar">
                        <button onClick={onNext}>
                            Next
                        </button>
                        <button onClick={onPause}>
                            {isPaused ? "Start" : "Pause"}
                        </button>
                        <button onClick={handleRestStart}>
                            Rest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Now;
