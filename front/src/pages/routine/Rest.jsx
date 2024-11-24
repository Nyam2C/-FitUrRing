import React, { useState } from "react";
import './Rest.css';

function Rest() {
    const [seconds, setSeconds] = useState("");

    const getDisplayText = (seconds) => {
        if (seconds<=0) return "";
        if (seconds >= 0 && seconds <= 60) return "파이팅 넘치네요";
        if (seconds > 60 && seconds <= 120) return "오늘도 아자아자";
        if (seconds > 120 && seconds <= 180) return "오늘은 느긋하게";
        if (seconds > 180) return "쉬려고 왔나요?";
    };

    const formatInputValue = () => {
        if (seconds === "") return ""; // 빈 값일 때는 그대로 비워둠
        return `${seconds}초`; // 숫자 뒤에 "초" 추가
      };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // 숫자만 입력 가능
            setSeconds(value === "0" ? "" : value); // 0이면 빈 값으로 설정
        }
    };

    return (
        <div className="rest_container">
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
