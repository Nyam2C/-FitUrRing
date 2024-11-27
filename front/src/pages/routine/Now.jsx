import React, { useState, useEffect, useRef } from 'react';
import "./Now.css";

function Now({ currentVideo, onNext, isRest, restSeconds, isActive, onPause, isPaused }) {
    const [exerciseTime, setExerciseTime] = useState(0); // 현재 운동 타이머
    const [restTime, setRestTime] = useState(0); // 현재 휴식 타이머
    const [restTimeLeft, setRestTimeLeft] = useState(restSeconds); // 휴식 타이머
    const [isTakingBreak, setIsTakingBreak] = useState(false); // 휴식 상태
    const [linkOpened, setLinkOpened] = useState(false); // 현재 운동에서 창 열림 여부
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [count, setCount] = useState(null); // 카운트다운 상태
    const message = ["운동을 시작하겠습니다", "1", "2", "3"];
    const countRef = useRef(3); // useRef로 count 값 추적

    useEffect(() => {
        // 운동 타이머 관리
        if (isRest || isPaused || !isActive || isTakingBreak) return;

        const timer = setInterval(() => {
            setExerciseTime((prev) => prev + 1); // 운동 타이머 증가
        }, 1000);

        return () => clearInterval(timer); // 타이머 정리
    }, [isRest, isPaused, isActive, isTakingBreak]);

    useEffect(() => {
        // 휴식 타이머 관리
        if (!isTakingBreak) return;

        const timer = setInterval(() => {
            setRestTime((prev) => prev + 1); // 휴식 타이머 증가
        }, 1000);

        return () => clearInterval(timer); // 타이머 정리
    }, [isTakingBreak]);

    useEffect(() => {
        if (!isRest || isPaused || !isActive || isTakingBreak) return;

        // restTimeLeft가 3 이하일 경우 handleRestNext 호출 및 조기 종료
        if (restTimeLeft <= 3) {
            handleRestNext();
            return;
        }

        // 타이머 설정
        const timer = setInterval(() => {
            setRestTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer); // 타이머 정리
                    onNext(); // 다음 동작 실행
                    return 0; // 최종값 0으로 설정
                }
                return prev - 1; // 남은 시간 감소
            });
        }, 1000);

        // 타이머 정리
        return () => clearInterval(timer);
    }, [isRest, restTimeLeft, onNext]);

    useEffect(() => {
        // 새 운동으로 넘어갈 때 타이머 초기화
        if (currentVideo) {
            setExerciseTime(0); // 새로운 운동 타이머 초기화
            setLinkOpened(false); // 새 운동으로 창 띄우기 초기화
        }
    }, [currentVideo]);

    useEffect(() => {
        // 현재 운동에서 최초 1회만 링크 열기
        if (!isRest && currentVideo?.link && isActive && !linkOpened) {
            window.open(currentVideo.link, "_blank", "noopener,noreferrer");
            setLinkOpened(true);
        }
    }, [currentVideo, isRest, isActive, linkOpened]);

    const handleRestStart = () => {
        setIsTakingBreak(true); // 휴식 상태 활성화
    };

    const handleRestStop = () => {
        setIsTakingBreak(false); // 휴식 상태 비활성화
        setRestTime(0); // 휴식 타이머 초기화
    };

    const handleRestNext = () => {
        setRestTimeLeft(restSeconds); // 휴식 타이머 초기화
        setIsModalOpen(true);
        startCountdown();

    };
    const startCountdown = () => {
        countRef.current = 3; // 초기값 설정
        setCount(countRef.current); // UI에 반영

        const countdownFunction = () => {
            if (countRef.current <= 0) {
                setIsModalOpen(false); // 모달 닫기
                onNext();
                return; // 종료
            }

            countRef.current -= 1; // 동기적으로 변수 값 업데이트
            setCount(countRef.current); // UI에 반영
            setTimeout(countdownFunction, 1000); // 1초마다 호출
        };

        countdownFunction(); // 타이머 시작
    };

    useEffect(() => {
        if (count <= 0) {
            setIsModalOpen(false); // 모달 닫기
        }
    }, [count]);


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
                                    {count !== null && <p>{count}</p>}
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
