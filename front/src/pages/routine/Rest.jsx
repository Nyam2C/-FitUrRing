import React, { useState } from "react";
import './Rest.css';

function Rest({ onRestChange, isActive }) {
    const [seconds, setSeconds] = useState(""); // 운동 간 쉬는 시간
    const [warning, setWaring] = useState(false); // 쉬는 시간이 300 초과인지 확인 여부

    /*
        설정 시간에 따른 출력 텍스트 설정
    */
    const getDisplayText = (seconds) => {
        if (isActive) return "파이팅 해야지";
        if (warning) return "덜 쉬어봐요";
        if (seconds <= 0) return "";
        if (seconds >= 0 && seconds <= 60) return "파이팅 넘치네요";
        if (seconds > 60 && seconds <= 120) return "오늘도 아자아자";
        if (seconds > 120 && seconds <= 180) return "오늘은 느긋하게";
        if (seconds > 180) return "쉬려고 왔나요?";
    };
    
    /*
        운동 시작 전 쉬는 시간 설정 및 타이머 시간 설정을 위한 값 전달
    */
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)&&!isActive) {
            const restValue = value === 0 ? "" : value;
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
                />
                <span>rest period</span>
            </div>
        </div>
    );
};

export default Rest;
