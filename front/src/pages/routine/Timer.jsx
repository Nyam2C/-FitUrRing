import React, { useState, useEffect } from "react";
import "./Timer.css";

function Timer({ duration, isActive }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [progress, setProgress] = useState(0);
    const [timeover, setTimeover] = useState(0);

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

    useEffect(() => {
        setProgress(((duration - timeLeft) / duration) * 100);
    }, [timeLeft, duration]);

    const formatTime = (seconds) => {
        seconds = Math.abs(seconds);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

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
