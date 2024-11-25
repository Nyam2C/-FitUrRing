import React from "react";
import "./Now.css";

function Now({ currentVideo, onNext }) {
    if (!currentVideo) {
        return (
            <div className="now-container">
                <p>선택된 영상이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="now-container">
            <div className="now-thumbnail">
                <img
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
                />
                <p className="now-title">{currentVideo.title}</p>
            </div>
            <div className="now-controls">
                <button onClick={onNext} className="next-button">
                    ▶
                </button>
            </div>
        </div>
    );
}

export default Now;
