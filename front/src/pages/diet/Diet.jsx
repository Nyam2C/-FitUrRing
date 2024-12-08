import React, { useEffect, useState } from 'react';
import BmrDisplay from './BmrDisplay';
import WeightBar from './WeightBar';
import WeightChart from './WeightChart';
import MealRecord from './MealRecord';
import Checkactivity from './Checkactivity';
import { getDietData, getUserData } from './api';
import "./Diet.css"

function App() {
  const [user, setUser] = useState([]);
  const [diet, setDiet] = useState([]);
  const [update, setUpdate] = useState(false);
  const [activity, setActivity] = useState(2);

  useEffect(() => {
    const fetchDietData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 13);

        const data = await getDietData(null, startDate, endDate);
        setDiet(data);
        setUpdate(false);
      } catch (err) {
        alert(err.message);
      }
    };

    try {
      fetchDietData();
    } catch (err) {
      console.error('Error fetching diet data:', err);
    }
  }, [update]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        if(!userData.user_weight||!userData.user_height){
          alert("회원님의 키와 몸무게가 저장되어있지 않습니다. My Page에서 정보를 입력해주세요.");
          window.location.href = "/mypage";
        }
        setUser(userData);
      } catch (err) {
        alert(err.message);
      }
    };

    try {
      fetchUser();
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, []);

  const handleButtonClick = (act) => {
    setActivity(act);
  };

  return (
    <div id='Diet-container'>
      <div id='SideBar'>
        <BmrDisplay user={user} diet={diet} activity={activity} />
        <WeightBar diet={diet} />
        <Checkactivity onButtonClick={handleButtonClick} />
      </div>
      <div id='Contents'>
        <WeightChart diet={diet} />
        <MealRecord diet={diet} />
      </div>
    </div>
  );
}

export default App;
