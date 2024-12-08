import React, { useState, useEffect } from "react";
import "./List.css";
import truncateText from './truncateText';
import {getUserRoutines, getRoutineVideos, deleteRoutine, createRoutine} from '../../api/routineAPI';

function List({ onRoutineSelect, isActive }) {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [modify, setModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: '#000000',
    background: 'rgba(0, 0, 0, 0.1)', 
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999, 
  };
  
  const modalContentStyle = {
    background: 'white', 
    padding: '40px',
    fontSize: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  };
  
  const buttonStyle = {
    height: '60px',
    width: '140px',
    margin: '30px',
    fontSize: '0.7em',
    cursor: 'pointer',
  };

  // 루틴 데이터와 비디오 데이터 함께 가져오기
  const fetchRoutines = async () => {
    try {
      const data = await getUserRoutines();
      setRoutines(data || []); // 데이터가 없는 경우 빈 배열 설정
    } catch (error) {
      console.error("루틴 목록 가져오기 실패:", error);
      setRoutines([]); // 에러 발생 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleRoutineClick = async (routine) => {
    if (!modify && routine) {
      try {
        const videos = await getRoutineVideos(routine.routine_name);
        const formattedRoutine = {
          name: routine.routine_name,
          exercises: videos
        };
        setSelectedRoutine(formattedRoutine);
        onRoutineSelect(formattedRoutine);
      } catch (error) {
        console.error("루틴 비디오 가져오기 실패:", error);
        // 에러 발생 시 사용자에게 알림
        alert("루틴 정보를 가져오는데 실패했습니다.");
      }
    }
  };

  const handleBackClick = () => {
    setSelectedRoutine(null);
  };

  const handledelete = async (name) => {
    try {
      await deleteRoutine(name);
      setIsModalOpen(false);
      await fetchRoutines(); // 삭제 후 목록 새로고침
    } catch (err) {
      alert(err);
    }
  };

  const handleAddRoutine = async () => {
    try {
        const routineName = prompt("새로운 루틴의 이름을 입력하세요:");
        if (!routineName) {
            return; // 사용자가 취소하거나 빈 문자열 입력 시
        }
        
        // 특수문자나 공백만 있는 경우 체크
        if (!/\S/.test(routineName)) {
            alert("유효한 루틴 이름을 입력해주세요.");
            return;
        }

        await createRoutine(routineName);
        alert("루틴이 성공적으로 생성되었습니다.");
        await fetchRoutines(); // 목록 새로고침
    } catch (err) {
        console.error("루틴 추가 실패:", err);
        alert(err.message || "루틴 추가에 실패했습니다.");
    }
  };

  return (
    <div id="list-container">
      {!selectedRoutine ? (
        <div className="list-head">
          <div>
            <span>routine</span>
            <div className="division-line"></div>
          </div>
          <div id="list-content">
            <ul>
              {routines && routines.length > 0 ? (
                routines.map((routine, index) => (
                  <li
                    key={index}
                    onClick={() => handleRoutineClick(routine)}
                    className={selectedRoutine?.name === routine.routine_name ? 'pick' : ''}
                  >
                    <span>{truncateText(routine.routine_name || '')}</span>
                    {modify && (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}>X</button>
                    )}
                    {isModalOpen && (
                      <div style={modalStyle}>
                        <div style={modalContentStyle}>
                          <div>
                            루틴을 삭제하겠습니까?
                            <div>
                              <button style={buttonStyle} onClick={() => handledelete(routine.routine_name)}>삭제</button>
                              <button style={buttonStyle} onClick={() => setIsModalOpen(false)}>취소</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li className="no-routine-message">
                  <span>루틴이 없습니다. 새로운 루틴을 추가해주세요.</span>
                </li>
              )}
            </ul>
            <div className="list-foot">
              {!modify ? (
                <button className='back' onClick={() => setModify(true)}>수정</button>
              ) : (
                <>
                  <button className='add' onClick={handleAddRoutine}>추가</button>
                  <button className='back' onClick={() => setModify(false)}>뒤로가기</button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="list-head">
          <div>
            <span>{selectedRoutine.name}</span>
            <div className="division-line"></div>
          </div>
          <div id="list-content">
            <ul>
              {selectedRoutine.exercises && selectedRoutine.exercises.length > 0 ? (
                selectedRoutine.exercises.map((exercise, index) => (
                  <li key={index}>
                    <span>{truncateText(exercise.title, 11)}</span>
                  </li>
                ))
              ) : (
                <li className="no-exercise-message">
                  <span>운동이 없습니다. 운동을 추가해주세요.</span>
                </li>
              )}
            </ul>
            <div className="list-foot">
              <button 
                className="pick" 
                onClick={() => {
                  if (!isActive) {
                    onRoutineSelect(selectedRoutine);
                  }
                }}
                disabled={isActive || selectedRoutine.exercises.length === 0}
              >
                선택
              </button>
              <button className='back' onClick={handleBackClick}>뒤로가기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;
