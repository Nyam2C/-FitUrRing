import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Video.css";

function Video({ routine, onRoutineChange, onVideoClick }) {
    const [exercises, setExercises] = useState(routine.exercises);
    const [isDragging, setIsDragging] = useState(false);

    const restPeriod = 60;

    useEffect(() => {
        setExercises(routine.exercises);
    }, [routine]);

    const handleVideoClick = (exercise) => {
        window.open(exercise.link, "_blank", "noopener,noreferrer");
        onVideoClick(exercise);
    };

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

    return (
        <DragDropContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Droppable droppableId="video-list">
                {(provided) => (
                    <div
                        id="video-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            overflowY: "auto",
                            maxHeight: "90%",
                        }}
                    >
                        {exercises.map((exercise, index) => (
                            <Draggable
                                key={exercise.title}
                                draggableId={exercise.title}
                                index={index}
                            >
                                {(provided) => (
                                    <React.Fragment>
                                        <div
                                            className="video-info"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => handleVideoClick(exercise)}
                                        >
                                            <img src={exercise.thumbnail} alt={exercise.title} />
                                            <div className="video-title">{exercise.title}</div>
                                        </div>
                                        {index < exercises.length - 1 && (
                                            <div
                                                className="rest-period"
                                                style={{
                                                    visibility: isDragging ? "hidden" : "visible",
                                                }}
                                            >
                                                {restPeriod}초 - Rest Period
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Video;
