import React, { useState, useEffect } from "react";
import "./List.css";
import truncateText from './truncateText';
import routineAPI from '../../api/routineAPI';

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
      const routineData = await routineAPI.getUserRoutines();
      if (routineData) {
        // 각 루틴에 대해 비디오 정보 가져오기
        const routinesWithVideos = await Promise.all(
          routineData.map(async (routine) => {
            const videos = await routineAPI.getRoutineVideos(routine.routine_name);
            return {
              ...routine,
              exercises: videos.map(video => ({
                title: video.video_title,
                duration: video.video_time,
                link: video.video_url,
                thumbnail: video.video_thumbnail
              }))
            };
          })
        );
        setRoutines(routinesWithVideos);
      }
    } catch (err) {
      console.error("루틴 데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleRoutineClick = (routine) => {
    if (!modify) {
        const formattedRoutine = {
            name: routine.routine_name,
            exercises: []
        };
        setSelectedRoutine(formattedRoutine);
        onRoutineSelect(formattedRoutine);
    }
  };

  const handleBackClick = () => {
    setSelectedRoutine(null);
  };

  const handledelete = async (name) => {
    try {
      await routineAPI.deleteRoutine(name);
      setIsModalOpen(false);
      await fetchRoutines(); // 삭제 후 목록 새로고침
    } catch (err) {
      alert(err);
    }
  };

  const handleAddRoutine = async () => {
    try {
      const routineName = prompt("새로운 루틴의 이름을 입력하세요:");
      if (!routineName) return;
      
      await routineAPI.createRoutine(routineName);
      await fetchRoutines();
    } catch (err) {
      console.error("루틴 추가 실패:", err);
      alert("루틴 추가에 실패했습니다.");
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
                routines.map((routine) => (
                  <li key={routine._id} onClick={() => handleRoutineClick(routine)}>
                    <span>{truncateText(routine.routine_name, 10)}</span>
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
