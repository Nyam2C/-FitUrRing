import React, { useEffect, useState } from 'react';
import './Start.css';

function Start({ ButtonClick, isActive}) {
    // 오늘 날짜 생성
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    return (
        <div id="start-container">
            <div className="today">{getTodayDate()}</div>
            <button
                className={`${isActive ? 'stop-button' : 'start-button'}`}
                onClick={ButtonClick}
            >
                <span>{isActive ? 'STOP' : 'START'} </span>
            </button>
        </div>

    );
}

export default Start;