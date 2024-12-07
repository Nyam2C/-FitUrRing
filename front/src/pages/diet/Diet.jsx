import React, { useEffect, useState } from 'react';
import BmrDisplay from './BmrDisplay';
import WeightBar from './WeightBar';
import WeightChart from './WeightChart';
import MealRecord from './MealRecord';
import { getDietData, getUserData } from './api';
import "./Diet.css"

function App() {
  const [user, setUser] = useState([]);
  const [diet, setDiet] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchDietData = async () => {
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() - 14);

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

  return (
    <div id='Diet-container'>
      <div id='SideBar'>
        <BmrDisplay user={user} diet={diet} />
        <WeightBar diet={diet} />
      </div>
      <div id='Contents'>
        <WeightChart diet={diet} />
        <MealRecord diet={diet} onClick={setUpdate(true)} />
      </div>
    </div>
  );
}

export default App;
