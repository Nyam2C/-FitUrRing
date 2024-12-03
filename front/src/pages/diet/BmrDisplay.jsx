import NutrientDisplay from './NutrientDisplay';
import React, { useEffect, useState } from 'react';
import './BmrDisplay.css';

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
                        <span>{Math.round(constants[diet.user_activity] * bmr)}</span>
                        <p>kcal</p>

                    </div>
                </div>
            </div>
            <NutrientDisplay user={user} bmr={bmr} diet={diet} />
        </React.Fragment>
    );
}

export default BmrDisplay;