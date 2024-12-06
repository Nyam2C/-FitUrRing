import React, { useState, useEffect } from "react";
import "./Timer.css";
import formatTime from "./formatTime"

function Timer({ duration, isActive }) {
    const [timeLeft, setTimeLeft] = useState(duration); // 남은 시간
    const [progress, setProgress] = useState(0); // 타이머 진행도
    const [timeover, setTimeover] = useState(0); // 타이머 종료 후 타이머 크기 증가를 위한 가중치

    /*  
        운동 시작 시 타이머 시간 감소
    */
    useEffect(() => {
        if (!isActive) return;
        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) setTimeover((prevTimeover) => prevTimeover + 0.2);
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerInterval);
    }, [isActive]);

    /*
        초기 타이머 시간 설정
    */
    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    /*
        타이머 진행도 업데이트
    */
    useEffect(() => {
        setProgress(((duration - timeLeft) / duration) * 100);
    }, [timeLeft, duration]);

    return (
        <div id="timer-container">
            <svg className="circle">
                <circle className="inside-circle" />
                <circle className={`outside-circle ${timeLeft <= 0 ? 'time-over' : 'time-off'}`}
                    strokeDashoffset={376.99 - (progress / 100) * 376.99}
                    transform="rotate(-90 70 70)"
                    strokeWidth={20 + timeover}
                />
            </svg>
            <div className={`time-text ${timeLeft <= 0 ? 'time-over' : 'time-off'}`}>{formatTime(timeLeft)}</div>
        </div>
    );
};

export default Timer;
