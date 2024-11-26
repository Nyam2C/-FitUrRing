import React from "react";
import "./Video.css";

function Video({ routine, onVideoClick }) {
    const handleVideoClick = (exercise) => {
        // 운동 정보 클릭 시 새 탭에서 링크 열기
        window.open(exercise.link, "_blank", "noopener,noreferrer");
        // 운동 정보 클릭 시 해당 운동을 선택하도록 onVideoClick 호출
        onVideoClick(exercise);
    };
    const restPeriod = 60;

    return (
        <div id="video-container">
            {routine.exercises.map((exercise, index) => (
                <React.Fragment key={index}>
                    {/* 운동 정보 */}
                    <div
                        className="video-info"
                        onClick={() => handleVideoClick(exercise)}
                    >
                        {/* 썸네일 */}
                        <img
                            src={exercise.thumbnail}
                            alt={exercise.title}
                        />
                        {/* 운동 정보 */}
                        <div className="video-title">{exercise.title}</div>
                    </div>
                    {index < routine.exercises.length - 1 && (
                        <div className="rest-period">
                            {restPeriod}초 - Rest Period
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default Video;
