import React, { useState, useEffect } from 'react';
import './WeightBar.css'
import { getUserData, getWeightHistory } from './api';

function WeightBar({ diet }) {
    const [percentage, setPercentage] = useState(0);
    const [goalWeight, setGoalWeight] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [weightHistory, setWeightHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData();
                const weightHistoryData = await getWeightHistory();
                
                setUserInfo(userData);
                setWeightHistory(weightHistoryData);
                
                if (userData.user_weight && goalWeight) {
                    const startWeight = weightHistory[0]?.weight || userData.user_weight;
                    const currentWeight = userData.user_weight;
                    const progress = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100;
                    setPercentage(Math.min(Math.max(progress, 0), 100));
                }
            } catch (error) {
                console.error('데이터를 가져오는데 실패했습니다:', error);
            }
        };

        fetchData();
    }, [goalWeight]);

    const handleGoalWeightSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
    };

    return (
        <div className='WeightBar-container'>
            <h3>체중 목표</h3>
            <div className="weight-bar">
                <div className='per'>{percentage.toFixed(1)}%</div>
                <div className="bar">
                    <div className="bar-progress" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className='suchi'>
                    <span>{weightHistory[0]?.weight || userInfo?.user_weight}kg</span>
                    {isEditing ? (
                        <form onSubmit={handleGoalWeightSubmit}>
                            <input
                                type="number"
                                value={goalWeight}
                                onChange={(e) => setGoalWeight(e.target.value)}
                                onBlur={() => setIsEditing(false)}
                                autoFocus
                            />
                            <span>kg</span>
                        </form>
                    ) : (
                        <span onClick={() => setIsEditing(true)}>
                            {goalWeight ? `${goalWeight}kg` : '목표 체중 설정'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WeightBar;