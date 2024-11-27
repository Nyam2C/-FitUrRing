import React, { useEffect } from "react";
import "./Now.css";

function Now({ currentVideo, onNext, isRest, restSeconds, isActive }) {
    useEffect(() => {
        if (!isRest && currentVideo?.link && isActive) {
            // 영상 변경 시 링크 열기
            window.open(currentVideo.link, "_blank", "noopener,noreferrer");
        }
    }, [currentVideo, isRest]);

    return (
        <div className={`now-container ${isRest ? "rest-highlight" : ""}`}>
            {isRest ? (
                <div className="now-rest">
                    <p>Rest Period</p>
                    <h3>{restSeconds} seconds</h3>
                    <button className="next-button" onClick={onNext}>
                        Next
                    </button>
                </div>
            ) : (
                <div className="now-video">
                    {currentVideo?.thumbnail && (
                        <div className="now-thumbnail">
                            <img
                                src={currentVideo.thumbnail}
                                alt={currentVideo.title}
                                className="now-thumbnail"
                            />
                            <p className="now-title">{currentVideo.title}</p>
                        </div>
                    )}
                    <button className="next-button" onClick={onNext}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Now;
