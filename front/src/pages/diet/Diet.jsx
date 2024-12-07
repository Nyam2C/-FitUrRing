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
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate-13);

        const data = await getDietData(null, startDate, endDate);
        setDiet(data);
        setUpdate(false);
      } catch (err) {
        alert(err);
      }
    };

    fetchDietData();
  }, [update]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData(['user_name', 'user_gender', 'user_birth']);
        setUser(userData);
      } catch (err) {
        alert(err);
      }
    };

    fetchUser();
  }, []);

  const handleButtonClick = (act) => {
    setActivity(act);
  };


  return (
    <div id='Diet-container'>
      <div id='SideBar'>
        <BmrDisplay user={user} diet={diet} activity = {activity} />
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
