import React, { useState, useEffect } from 'react';
import './Start.css';

function Start({ ButtonClick, isActive, hasRoutine }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [hasStarted, setHasStarted] = useState(false); // 운동 시작 상태
    const [countdown, setCountdown] = useState(null); // 카운트다운 상태

    const message = ["운동을 시작하겠습니다", "1", "2", "3"];

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleStartClick = () => {
        if (!hasRoutine) {
            setIsModalOpen(true); // 운동 선택 요청 모달 표시
        } else if (!hasStarted) {
            setIsModalOpen(true); // 운동 시작 모달 표시
        }
    };

    const startCountdown = () => {
        let count = 3;
        setCountdown(count); // 초기 카운트다운 설정

        const interval = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === -1) {
                clearInterval(interval);
                setIsModalOpen(false); // 모달 닫기
                ButtonClick(); // 부모 컴포넌트로 시작 신호 전달
                setHasStarted(true); // 운동 시작 상태로 전환
            }
        }, 1000); // 1초 간격으로 업데이트
    };

    const handleConfirm = () => {
        if (!hasRoutine) {
            setIsModalOpen(false); // 운동 선택 요청 모달 닫기
        } else {
            startCountdown(); // 카운트다운 시작
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    return (
        <div id="start-container">
            <div className="today">{getTodayDate()}</div>
            <button
                className={`${isActive ? 'stop-button' : 'start-button'}`}
                onClick={handleStartClick}
                disabled={hasStarted} // 시작 후 비활성화
            >
                <span>{isActive ? 'STOP' : 'START'} </span>
            </button>

            {/* 모달 */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div id="modal-contents">
                            {!hasRoutine ? (
                                <p>운동을 선택해 주세요!</p>
                            ) : countdown !== null ? (
                                <span>{message[countdown]}</span>
                            ) : (
                                <p>운동을 시작하겠습니까?</p>
                            )}
                            <div>
                                {countdown === null && (
                                    <>
                                        <button onClick={handleConfirm}>확인</button>
                                        {hasRoutine && <button onClick={handleCancel}>취소</button>}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Start;
