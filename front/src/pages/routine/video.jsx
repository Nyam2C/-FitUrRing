import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    const [exercises, setExercises] = useState(routine.exercises);
    const [isDragging, setIsDragging] = useState(false);
    const videoRefs = useRef([]);

    useEffect(() => {
        setExercises(routine.exercises);
    }, [routine]);

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

    const handleDragEnd = (result) => {
        setIsDragging(false);

        if (!result.destination) return;

        const updatedExercises = Array.from(exercises);
        const [movedItem] = updatedExercises.splice(result.source.index, 1);
        updatedExercises.splice(result.destination.index, 0, movedItem);
        setExercises(updatedExercises);
        onRoutineChange(updatedExercises);
    };

    const handleVideoClick = (exercise) => {
        window.open(exercise.link, "_blank", "noopener,noreferrer");
        onVideoClick(exercise);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="video-list" isDropDisabled={isActive}>
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
