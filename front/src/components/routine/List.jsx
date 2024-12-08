import React, { useState, useEffect } from "react";
import "./List.css";
import truncateText from './truncateText';
import { getUserRoutines, getRoutineVideos, deleteRoutine } from '../../api/routineAPI';

const initialRoutines = [
  {
    id: 1,
    name: "전신 루틴",
    exercises: [
      { title: "전신 운동 1", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=example1", duration: 300, canceled: false },
      { title: "전신 운동 2", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=example2", duration: 420, canceled: false },
      { title: "전신 운동 3", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=example3", duration: 350, canceled: false },
    ],
  },
  {
    id: 2,
    name: "상체 루틴",
    exercises: [
      { title: "상체 운동 1", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=example11", duration: 360, canceled: false },
      { title: "상체 운동 2", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=example12", duration: 400, canceled: false },
      { title: "상체 운동 3", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=example13", duration: 330, canceled: false },
      { title: "상체 운동 4", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4", link: "https://www.youtube.com/watch?v=example14", duration: 470, canceled: false },
      { title: "상체 운동 5", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail5", link: "https://www.youtube.com/watch?v=example15", duration: 380, canceled: false },
      { title: "상체 운동 6", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail6", link: "https://www.youtube.com/watch?v=example16", duration: 390, canceled: false },
      { title: "상체 운동 7", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail7", link: "https://www.youtube.com/watch?v=example17", duration: 420, canceled: false },
      { title: "상체 운동 8", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail8", link: "https://www.youtube.com/watch?v=example18", duration: 440, canceled: false },
      { title: "상체 운동 9", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail9", link: "https://www.youtube.com/watch?v=example19", duration: 350, canceled: false },
      { title: "상체 운동 10", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail10", link: "https://www.youtube.com/watch?v=example20", duration: 500, canceled: false },
    ],
  },
  {
    id: 3,
    name: "하체 루틴",
    exercises: [
      { title: "하체 운동 1", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=example21", duration: 350, canceled: false },
      { title: "하체 운동 2", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=example22", duration: 450, canceled: false },
      { title: "하체 운동 3", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=example23", duration: 400, canceled: false },
      { title: "하체 운동 4", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4", link: "https://www.youtube.com/watch?v=example24", duration: 500, canceled: false },
      { title: "하체 운동 5", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail5", link: "https://www.youtube.com/watch?v=example25", duration: 480, canceled: false },
      { title: "하체 운동 6", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail6", link: "https://www.youtube.com/watch?v=example26", duration: 420, canceled: false },
      { title: "하체 운동 7", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail7", link: "https://www.youtube.com/watch?v=example27", duration: 430, canceled: false },
      { title: "하체 운동 8", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail8", link: "https://www.youtube.com/watch?v=example28", duration: 360, canceled: false },
      { title: "하체 운동 9", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail9", link: "https://www.youtube.com/watch?v=example29", duration: 490, canceled: false },
      { title: "하체 운동 10", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail10", link: "https://www.youtube.com/watch?v=example30", duration: 460, canceled: false },
    ],
  },
  {
    id: 4,
    name: "복부 루틴",
    exercises: [
      { title: "복부 운동 1", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=example31", duration: 400, canceled: false },
      { title: "복부 운동 2", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=example32", duration: 300, canceled: false },
      { title: "복부 운동 3", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=example33", duration: 350, canceled: false },
      { title: "복부 운동 4", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4", link: "https://www.youtube.com/watch?v=example34", duration: 380, canceled: false },
      { title: "복부 운동 5", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail5", link: "https://www.youtube.com/watch?v=example35", duration: 320, canceled: false },
      { title: "복부 운동 6", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail6", link: "https://www.youtube.com/watch?v=example36", duration: 370, canceled: false },
      { title: "복부 운동 7", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail7", link: "https://www.youtube.com/watch?v=example37", duration: 390, canceled: false },
      { title: "복부 운동 8", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail8", link: "https://www.youtube.com/watch?v=example38", duration: 430, canceled: false },
      { title: "복부 운동 9", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail9", link: "https://www.youtube.com/watch?v=example39", duration: 480, canceled: false },
      { title: "복부 운동 10", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail10", link: "https://www.youtube.com/watch?v=example40", duration: 500, canceled: false },
    ],
  },
  {
    id: 5,
    name: "유산소 루틴",
    exercises: [
      { title: "유산소 운동 1", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=example41", duration: 600, canceled: false },
      { title: "유산소 운동 2", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=example42", duration: 500, canceled: false },
      { title: "유산소 운동 3", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=example43", duration: 550, canceled: false },
      { title: "유산소 운동 4", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4", link: "https://www.youtube.com/watch?v=example44", duration: 510, canceled: false },
      { title: "유산소 운동 5", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail5", link: "https://www.youtube.com/watch?v=example45", duration: 560, canceled: false },
      { title: "유산소 운동 6", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail6", link: "https://www.youtube.com/watch?v=example46", duration: 530, canceled: false },
      { title: "유산소 운동 7", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail7", link: "https://www.youtube.com/watch?v=example47", duration: 480, canceled: false },
      { title: "유산소 운동 8", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail8", link: "https://www.youtube.com/watch?v=example48", duration: 540, canceled: false },
      { title: "유산소 운동 9", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail9", link: "https://www.youtube.com/watch?v=example49", duration: 490, canceled: false },
      { title: "유산소 운동 10", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail10", link: "https://www.youtube.com/watch?v=example50", duration: 520, canceled: false },
    ],
  },
  {
    id: 6,
    name: "스트레칭 루틴",
    exercises: [
      { title: "스트레칭 운동 1", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=example51", duration: 300, canceled: false },
      { title: "스트레칭 운동 2", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=example52", duration: 400, canceled: false },
      { title: "스트레칭 운동 3", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=example53", duration: 350, canceled: false },
      { title: "스트레칭 운동 4", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4", link: "https://www.youtube.com/watch?v=example54", duration: 300, canceled: false },
      { title: "스트레칭 운동 5", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail5", link: "https://www.youtube.com/watch?v=example55", duration: 380, canceled: false },
      { title: "스트레칭 운동 6", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail6", link: "https://www.youtube.com/watch?v=example56", duration: 420, canceled: false },
      { title: "스트레칭 운동 7", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail7", link: "https://www.youtube.com/watch?v=example57", duration: 440, canceled: false },
      { title: "스트레칭 운동 8", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail8", link: "https://www.youtube.com/watch?v=example58", duration: 450, canceled: false },
      { title: "스트레칭 운동 9", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail9", link: "https://www.youtube.com/watch?v=example59", duration: 500, canceled: false },
      { title: "스트레칭 운동 10", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail10", link: "https://www.youtube.com/watch?v=example60", duration: 480, canceled: false },
    ],
  },
  {
    id: 7,
    name: "등 루틴",
    exercises: [
      { title: "업그레이드를 위한 새로운 등운동 [ BACK DAY ]", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail1", link: "https://www.youtube.com/watch?v=f7wFbp9BnFs", duration: 300, canceled: false },
      { title: "뚫고 나오는 등 만들고 싶으면 이거 봐", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail2", link: "https://www.youtube.com/watch?v=8SBBp65Sv3c", duration: 400, canceled: false },
      { title: "Try This Back Exercise | Back & Hamstrings Workout", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail3", link: "https://www.youtube.com/watch?v=nRzAV-CYndA", duration: 350, canceled: false },
      { title: "My Title Winning Back Training", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail4", link: "https://www.youtube.com/watch?v=5dp2FUN3mRQ", duration: 300, canceled: false },
      { title: "Back and Delts Workout", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail5", link: "https://www.youtube.com/watch?v=DjfnFj-50b4", duration: 380, canceled: false },
      { title: "INTENSE Back Workout | Mr. Olympia Derek Lunsford", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail6", link: "https://www.youtube.com/watch?v=HYngFKG5YbY&t=477s", duration: 420, canceled: false },
      { title: "Mr. Olympia BACK WORKOUT", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail7", link: "https://www.youtube.com/watch?v=HqZOWPRyck8&t=134s", duration: 440, canceled: false },
      { title: "등 운동 후 몽둥이질 당한 느낌이 나게 하는 방법들", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail8", link: "https://www.youtube.com/watch?v=OD1JMTLJp-A", duration: 450, canceled: false },
      { title: "등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) 등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) 등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) 등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) 등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) 등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) 등 운동 하는 날 반드시 시청해야 할 영상 ( feat.등 운동 루틴 풀버전 ) ", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail9", link: "https://www.youtube.com/watch?v=naxGvgl9pKg&t=1102s", duration: 500, canceled: false },
      { title: "요즘 유행하는 등 운동 루틴", thumbnail: "https://via.placeholder.com/150x100.png?text=Thumbnail10", link: "https://www.youtube.com/watch?v=XLCtwqECMrs&t=279s", duration: 480, canceled: false },
    ],
  },
];

function List({ onRoutineSelect, isActive }) {

  const [routines, setRoutines] = useState(initialRoutines); // 루틴 목록
  const [selectedRoutine, setSelectedRoutine] = useState(null); // 선택한 루틴
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

const fetchRoutines = async () => {
  try {
    const data = await getUserRoutines();
    fetchExercises(data);
  } catch (err) {
    alert(err);
  }
};

const fetchExercises = async (routines) => {
  try {
    const updatedRoutines = await Promise.all(
      routines.map(async (rt) => {
        const data = await getRoutineVideos(rt.name);
        const updatedExercises = data.map((exercise) => ({
          ...exercise,
          canceled: false,
        }));
        return { ...rt, exercises: updatedExercises };
      })
    );
    setRoutines(updatedRoutines);
  } catch (err) {
    alert(err);
  }
};

useEffect(() => {
  fetchRoutines();
}, []);

/*
  루틴 목록에서 원하는 루틴 클릭 시 해당 루틴을 selectedRoutine으로 설정하여 
  해당 루틴 운동 목록화면으로 전환
*/
const handleRoutineClick = (routine) => {
  if (!modify) setSelectedRoutine(routine);

};

/*
  뒤로가기 클릭 시 selectedRoutine 값을 null로 설정하여 루틴 목록화면으로 전환
*/
const handleBackClick = () => {
  setSelectedRoutine(null);
};

const handledelete = async (name) => {
  try {
    await deleteRoutine(name);
    setIsModalOpen(false);
  } catch (err) {
    alert(err);
  }
};

/*
  토글 클릭 시 해당 운동의 루틴 제외 여부 설정
*/
const toggleCancelExercise = (exercise) => {
  const updatedExercises = selectedRoutine.exercises.map((ex) =>
    ex.title === exercise.title ? { ...ex, canceled: !ex.canceled } : ex
  );
  setSelectedRoutine({ ...selectedRoutine, exercises: updatedExercises });
};

return (
  <div id="list-container">
    {!selectedRoutine ? (
      <div className="list-head">
        {/*selectedRoutine이 null로 루틴 목록 화면 표시*/}
        <div>
          <span>routine</span>
          <div className="division-line"></div>
        </div>
        <div id="list-content">
          <ul>
            {routines.map((routine) => (
              <li key={routine.id} onClick={() => handleRoutineClick(routine)}>
                <span>{truncateText(routine.name, 10)}</span>
                {modify && (
                  <button onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 중단
                    setIsModalOpen(true);
                  }}>X</button>

                )}
                {isModalOpen && (
                  <div style={modalStyle}>
                    <div style={modalContentStyle}>
                      <div>
                        루틴을 삭제하겠습니까?
                        <div>
                          <button style={buttonStyle} onClick={() => handledelete(routine.title)}>삭제</button>
                          <button style={buttonStyle} onClick={() => setIsModalOpen(false)}>취소</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {!modify ? (<button className='back' onClick={() => setModify(true)}>수정</button>
          ) : (<button className='back' onClick={() => setModify(false)}>뒤로가기</button>)}
        </div>
      </div>
    ) : (
      <div className="list-head">
        {/*selectedRoutine이 설정 되어 운동 목록 화면 표시*/}
        <div>
          <span>{selectedRoutine.name}</span>
          <div className="division-line"></div>
        </div>
        <div id="list-content">
          <ul>
            {selectedRoutine.exercises.map((exercise, index) => (
              <li key={index}>
                <span
                  style={{
                    textDecoration: exercise.canceled ? "line-through" : "none",
                  }}
                >
                  {truncateText(exercise.title, 11)}
                </span>
                <button onClick={() => toggleCancelExercise(exercise)}>
                  {exercise.canceled ? "X" : "O"}
                </button>
              </li>
            ))}
          </ul>
          <div className="list-foot">
            <button
              className="pick"
              onClick={() => {
                if (!isActive) {
                  onRoutineSelect({
                    ...selectedRoutine,
                    exercises: selectedRoutine.exercises.filter(
                      (exercise) => !exercise.canceled
                    ),
                  });
                }
              }}
            >
              선택
            </button>
            <button className='back' onClick={handleBackClick}>뒤로가기</button>
          </div>
        </div>
      </div>
    )
    }
  </div >
);
}

export default List;
