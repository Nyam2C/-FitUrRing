import NutrientDisplay from './NutrientDisplay';
import React, { useEffect, useState } from 'react';
import { getUserData } from './api';
import './BmrDisplay.css';

function BmrDisplay({ user, diet, activity }) {
    const [bmr, setBmr] = useState(0);
    const [userInfo, setUserInfo] = useState([]);
    const [constants] = useState([1.2, 1.375, 1.555, 1.725, 1.9]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try{
                const data=await getUserData();
                setUserInfo(data);
            }catch(error){
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    const calculateBmr = () => {
        if (!userInfo.user_gender || !userInfo.user_weight || 
            !userInfo.user_height || !userInfo.user_birth) {
            return 0;
        }
        
        const today = new Date();
        const birthYear = new Date(userInfo.user_birth).getFullYear();
        const age = today.getFullYear() - birthYear;
        
        if (userInfo.user_gender === 1) {
            return 66.47 + (13.75 * userInfo.user_weight) + (5 * userInfo.user_height) - (6.76 * age);
        } else {
            return 655.1 + (9.56 * userInfo.user_weight) + (1.85 * userInfo.user_height) - (4.68 * age);
        }
    };

    useEffect(() => {
        const calculatedBmr = calculateBmr();
        if (!isNaN(calculatedBmr)) {
            setBmr(Math.round(calculatedBmr));
        }
    }, [userInfo]);

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