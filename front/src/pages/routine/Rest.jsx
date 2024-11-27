import React, { useState } from "react";
import './Rest.css';

function Rest({ onRestChange, isActive }) {
    const [seconds, setSeconds] = useState("");
    const [warning, setWaring] = useState(false);

    const getDisplayText = (seconds) => {
        if (isActive) return "파이팅 해야지";
        if (warning) return "덜 쉬어봐요";
        if (seconds <= 0) return "";
        if (seconds >= 0 && seconds <= 60) return "파이팅 넘치네요";
        if (seconds > 60 && seconds <= 120) return "오늘도 아자아자";
        if (seconds > 120 && seconds <= 180) return "오늘은 느긋하게";
        if (seconds > 180) return "쉬려고 왔나요?";
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)&&!isActive) {
            const restValue = value === "0" ? "" : value;
            if (restValue <= 300 || value === "") {
                setWaring(false);
                setSeconds(value); // 값이 300 이하일 때만 업데이트
                onRestChange(restValue || 0); // 부모에 변경 사항 전달
            } else setWaring(true);
        }
    };

    return (
        <div id="rest-container">
            <h1 className="comment">{getDisplayText(seconds)}</h1>
            <div>
                <input
                    type="number"
                    value={seconds}
                    onChange={handleInputChange}
                    placeholder="rest period"
                    max="300"
                />
                <span>rest period</span>
            </div>
        </div>
    );
};

export default Rest;
