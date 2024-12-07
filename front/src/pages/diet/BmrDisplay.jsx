import NutrientDisplay from './NutrientDisplay';
import React, { useEffect, useState } from 'react';
import './BmrDisplay.css';

function BmrDisplay({ user, diet, activity }) {
    const [bmr, setBmr] = useState(0);
    const [achievement, setAchievement] = useState([]);
    const [constants] = useState([1.2, 1.375, 1.555, 1.725, 1.9]);

    useEffect(() => {
        for (let i = 0; i < diet.length; i++) {
            if (diet[i]) {
                setAchievement(diet[i].achievement);
                break; 
            }
        }
    },[diet]);

    const calculateBmr = () => {
        if (user.user_gender === 1) {
            return 66.47 + (13.75 * achievement.weight) + (5 * achievement.height) - (6.76 * user.user_birth);
        } else {
            return 655.1 + (9.56 * achievement.weight) + (1.85 * achievement.height) - (4.68 * user.user_birth);
        }
    };

    useEffect(() => {
        const calculatedBmr = calculateBmr();
        setBmr(Math.round(calculatedBmr));
    });

    return (
        <React.Fragment>
            <div className='BmrDisplay-container'>
                <h1>{user.user_name}님의 식단 가이드</h1>
                <div className="calorie-info">
                    <div className="calorie-box">
                        <p>기초대사량</p>
                        <span>{bmr}</span>
                        <p>kcal</p>
                    </div>
                    <div className="calorie-box">
                        <p>총 대사량</p>
                        <span>{Math.round(constants[activity] * bmr)}</span>
                        <p>kcal</p>

                    </div>
                </div>
            </div>
            <NutrientDisplay user={user} bmr={Math.round(constants[activity] * bmr)} />
        </React.Fragment>
    );
}

export default BmrDisplay;