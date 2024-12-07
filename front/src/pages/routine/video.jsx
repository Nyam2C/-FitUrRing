import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import truncateText from './truncateText';
import "./Video.css";

function Video({
    routine,
    onRoutineChange,
    onVideoClick,
    isActive,
    currentIndex,
    isRest,
    restSeconds,
}) {
    const [exercises, setExercises] = useState(routine.exercises); // 루틴 운동 목록
    const [isDragging, setIsDragging] = useState(false); // 드래그 여부
    const videoRefs = useRef([]);

    useEffect(() => {
        setExercises(routine.exercises);
    }, [routine]);

    /*
        운동 변경시 해당 운동 화면 중앙으로 위치
    */
    useEffect(() => {
        const targetIndex = isRest ? currentIndex - 1 : currentIndex;
        if (videoRefs.current[targetIndex]) {
            videoRefs.current[targetIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }

    }, [currentIndex, isRest]);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    /*
        드래그 종료시 드래그 한 블록을 놓은 위치로 순서 변경
        선택한 블록을 updateExercises에서 제거하여 movedItem에 저장
        moveItem을 놓은 위치에 삽입하여 Exercises로 최종 업데이트
     */
    const handleDragEnd = (result) => {
        setIsDragging(false);

        if (!result.destination) return;

        const updatedExercises = Array.from(exercises);
        const [movedItem] = updatedExercises.splice(result.source.index, 1);
        updatedExercises.splice(result.destination.index, 0, movedItem);
        setExercises(updatedExercises);
        onRoutineChange(updatedExercises);
    };

    /*
        운동 클릭시 해당 영상 링크 오픈
     */
    const handleVideoClick = (exercise) => {
        window.open(exercise.link, "_blank", "noopener,noreferrer");
        if (!isActive) onVideoClick(exercise);
    };

    return (
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="video-list">
                {(provided) => (
                    <div
                        id="video-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {exercises.map((exercise, index) => (
                            <React.Fragment key={exercise.title}>
                                <Draggable
                                    draggableId={exercise.title}
                                    index={index}
                                    isDragDisabled={isActive}
                                >
                                    {(provided) => (
                                        <div
                                            ref={(el) => {
                                                provided.innerRef(el);
                                                videoRefs.current[index] = el;
                                            }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => handleVideoClick(exercise)}
                                            className={`video-info ${currentIndex === index && !isRest
                                                ? "highlighted"
                                                : ""
                                                }`}
                                        >
                                            <img src={exercise.thumbnail} alt={exercise.title} />
                                            <div className="video-title">{truncateText(exercise.title, 80)}</div>
                                        </div>
                                    )}
                                </Draggable>
                                {index < exercises.length - 1 && (
                                    <div
                                        className={`rest-period ${currentIndex - 1 === index && isRest
                                            ? "highlighted-rest"
                                            : ""
                                            }`}
                                        style={{
                                            visibility: isDragging ? "hidden" : "visible",
                                        }}

                                    >
                                        {restSeconds}초 - Rest Period
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Video;
