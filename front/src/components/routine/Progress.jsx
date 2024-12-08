import React, { useState, useEffect } from "react";
import "./progress.css";
import { addExerciseRecord } from '../../api/routineAPI';

function Progress({ currentVideo, times, endSignal, onendClick }) {
    const [restTimes, setRestTimes] = useState([]);
    const [exerciseTimes, setExerciseTimes] = useState([]);
    const [allTimes, setAllTimes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const colors = ["#242834", "#CFFF5E", "#B87EED", "#8C7DFF", "#FFFFFF"];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    // 누적 시간 상태
    const [totals, setTotals] = useState({ restTotal: 0, exerciseTotal: 0, allTotal: 0 });

    useEffect(() => {
        if (typeof times === "string") {
            const timeValue = parseInt(times.split(":")[1].trim(), 10);
            const randomColor = getRandomColor();
            if (times.startsWith("Rest:")) {
                setRestTimes((prev) => [...prev, timeValue]);
                setAllTimes((prev) => [...prev, { type: "Rest", value: timeValue, color: randomColor, id: Date.now() }]);
            } else if (times.startsWith("Exercise:")) {
                const tmp = new Date();
                const { canceled, ...recordvideo } = {
                    ...currentVideo,
                    date: tmp.toISOString().split("T")[0],
                };
                addExerciseRecord(recordvideo)
                    .then(() => {
                        setExerciseTimes((prev) => [...prev, timeValue]);
                        setAllTimes((prev) => [...prev, { type: "Exercise", value: timeValue, color: randomColor, id: Date.now() }]);
                    })
                    .catch((err) => {
                        alert(err);
                    });
            }
        }
    }, [times]);

    // 총합 계산
    useEffect(() => {
        const restTotal = restTimes.reduce((sum, time) => sum + time, 0);
        const exerciseTotal = exerciseTimes.reduce((sum, time) => sum + time, 0);
        const allTotal = restTotal + exerciseTotal;

        setTotals({ restTotal, exerciseTotal, allTotal });
    }, [restTimes, exerciseTimes]);

    // endSignal에 따라 모달 오픈
    useEffect(() => {
        if (endSignal) setIsModalOpen(true);
    }, [endSignal]);

    const calculateHeight = (value) => 2 * ((value + 60) / 60 + 1);

    return (
        <div className="progress-container">
            {[...allTimes].reverse().map((item, index) => {
                const height = calculateHeight(item.value);
                const isLastBlock = index === 0;

                return (
                    <div
                        key={item.id}
                        className={`progress-block ${isLastBlock ? "new-block" : ""}`}
                        style={{
                            height: `${height}px`,
                            backgroundColor: item.color,
                        }}
                    />
                );
            })}
            {(isModalOpen && endSignal) && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-content">
                            <p>
                                오늘은 총{" "}
                                {`${Math.floor(totals.allTotal / 60)}분 ${totals.allTotal % 60}초`}{" "}
                                동안 운동하셨고, 그 중 {`${Math.round((totals.exerciseTotal / totals.allTotal) * 100)}%`} 동안
                                운동하셨습니다!
                            </p>
                            <button onClick={() => { setIsModalOpen(false); onendClick(); }}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Progress;
