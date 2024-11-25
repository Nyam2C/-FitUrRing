import React, { useState } from "react";
import "./List.css";


function List() {
  const initialRoutines = [
    {
      id: 1,
      name: "전신 루틴",
      exercises: ["영상 1", "영상 2", "영상 3"],
    },
    {
      id: 2,
      name: "상체 루틴",
      exercises: ["영상 1", "영상 2", "영상 3"],
    },
    {
      id: 3,
      name: "하체 루틴",
      exercises: ["영상 1", "영상 2", "영상 3"],
    },
  ];

  const [routines, setRoutines] = useState(initialRoutines); // 전체 루틴 데이터
  const [selectedRoutine, setSelectedRoutine] = useState(null); // 선택된 루틴
  const [newExercise, setNewExercise] = useState(""); // 추가할 운동

  // 루틴 선택 처리
  const handleRoutineClick = (routine) => {
    setSelectedRoutine(routine);
    setNewExercise(""); // 새 운동 입력 필드 초기화
  };

  // 뒤로 가기 처리
  const handleBackClick = () => {
    setSelectedRoutine(null);
  };

  // 운동 추가 처리
  const handleAddExercise = () => {
    if (!newExercise.trim()) return; // 빈 입력 방지
    const updatedRoutines = routines.map((routine) =>
      routine.id === selectedRoutine.id
        ? { ...routine, exercises: [...routine.exercises, newExercise] }
        : routine
    );
    setRoutines(updatedRoutines);
    setSelectedRoutine({
      ...selectedRoutine,
      exercises: [...selectedRoutine.exercises, newExercise],
    });
    setNewExercise(""); // 입력 필드 초기화
  };

  // 운동 삭제 처리
  const handleDeleteExercise = (exercise) => {
    const updatedRoutines = routines.map((routine) =>
      routine.id === selectedRoutine.id
        ? {
          ...routine,
          exercises: routine.exercises.filter((ex) => ex !== exercise),
        }
        : routine
    );
    setRoutines(updatedRoutines);
    setSelectedRoutine({
      ...selectedRoutine,
      exercises: selectedRoutine.exercises.filter((ex) => ex !== exercise),
    });
  };

  return (
    <div className="List-container">
      {/* 루틴 목록 화면 */}
      {!selectedRoutine ? (
        <div className="list-head">
          <div>
            <span>routine</span>
            <div className="division-line"></div>
          </div>
          <ul>
            {routines.map((routine) => (
              <li
                key={routine.id}
                onClick={() => handleRoutineClick(routine)}
              >
                {routine.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // 선택된 루틴 화면
        <div className="list-head">
          <div>
            <span>{selectedRoutine.name}</span>
            <div className="division-line"></div>
          </div>
          <ul>
            {selectedRoutine.exercises.map((exercise, index) => (
              <li key={index}>
                {exercise}
                <button onClick={() => handleDeleteExercise(exercise)}>
                  X
                </button>
              </li>
            ))}
          </ul>

          {/* 운동 추가 */}
          <div>
            <button onClick={handleBackClick}>
              뒤로가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
