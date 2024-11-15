import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import BmrDisplay from './components/BmrDisplay';
import WeightBar from './components/WeightBar';
import WeightChart from './components/WeightChart';
import MealRecord from './components/MealRecord';

const All = styled.div`
  *{
      box-sizing: border-box;
      border-radius: 8px;
    }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 1425px;
  height: 700px;
  background-color: #eeeeee;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  height: 100%;
  background-color: #e0e0e0;
`;

const Content = styled.div`
  height: 100%;
  width: 75%;
  display: flex;
  flex-direction: column;
`;

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
    <All>
      <Container>
        <Sidebar>
          <BmrDisplay user = {user} diet = {diet} />
          <WeightBar diet = {diet} />
        </Sidebar>
        <Content>
          <WeightChart />
          <MealRecord />
        </Content>
      </Container>
    </All>
  );
}

export default App;
