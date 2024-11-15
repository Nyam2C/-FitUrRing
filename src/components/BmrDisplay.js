import styled from 'styled-components';
import NutrientDisplay from './NutrientDisplay';
import React, { useEffect, useState } from 'react';


const Header = styled.div`
    h2{
        font-weight: bold;
        font-size: 25px;
        margin-bottom: 10px;
        margin-top: 20px;
    }
    .calorie-info {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    .calorie-box {
        text-align: center;
        background-color: #eeeeee;
        height: 150px;
        width: 150px;
        padding: 30px 0;
        p {
            margin: 0;
            font-size: 18px;
            color: #666;
        }
        h3 {
            margin: 5px 0 0;
            font-size: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
    .kcal {
        font-size: 15px;
    }
`;

function BmrDisplay({ user, diet }) {
    const [bmr, setBmr] = useState(0);
    const [constants] = useState([1.2, 1.375, 1.555, 1.725, 1.9]);

    const calculateBmr = () => {
        if (user.user_gender === 1) {
            return 66.47 + (13.75 * user.user_weight) + (5 * user.user_height) - (6.76 * user.user_age);
        } else {
            return 655.1 + (9.56 * user.user_weight) + (1.85 * user.user_height) - (4.68 * user.user_age);
        }
    };

    useEffect(() => {
        const calculatedBmr = calculateBmr();
        setBmr(Math.round(calculatedBmr));
      });

    return (
        <Header>
            <h2>{user.user_name}님의 식단 가이드</h2>
            <div className="calorie-info">
                <div className="calorie-box">
                    <p>기초대사량</p>
                    <h3>
                        <span>{bmr}</span>
                        <span className="kcal">kcal</span>
                    </h3>
                </div>
                <div className="calorie-box">
                    <p>총 대사량</p>
                    <h3>
                        <span>{Math.round(constants[diet.user_activity] * bmr)}</span>
                        <span className="kcal">kcal</span>
                    </h3>
                </div>
            </div>
            <NutrientDisplay user = {user} bmr = {bmr} diet = {diet}/>
        </Header>
    );
}

export default BmrDisplay;