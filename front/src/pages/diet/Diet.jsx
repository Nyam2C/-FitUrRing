import React, { useEffect, useState } from 'react';
import BmrDisplay from './BmrDisplay';
import WeightBar from './WeightBar';
import WeightChart from './WeightChart';
import MealRecord from './MealRecord';
import "./Diet.css"

function App() {
  const [user,setUser] = useState([]);
  const [id,setID] = useState(1);
  const [diet,setDiet] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/${id}`)
    .then(response => response.json())
    .then(data => {setUser(data)})
    .catch(error => console.error('Error fetching user:', error));
  },[id]);

  useEffect(() => {
    fetch(`http://localhost:8000/diet/${id}/userinfo`)
    .then(response => response.json())
    .then(data => {setDiet(data)})
    .catch(error => console.error('Error fetching user:', error));
  },[id]);
  

  return (
      <div id='Diet-container'>
        <div id='SideBar'>
          <BmrDisplay user = {user} diet = {diet} />
          <WeightBar diet = {diet} />
        </div>
        <div id='Contents'>
          <WeightChart />
          <MealRecord />
        </div>
      </div>
  );
}

export default App;
