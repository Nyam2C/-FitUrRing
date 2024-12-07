import React, { useState, useEffect } from 'react';
import './WeightBar.css'

function WeightBar({ diet }) {
    const [percentage, setPercentage] = useState(0);
    const [goalweight, setGoalWeight] = useState(0);
    const [startweight, setStartWeight] = useState(0);

    useEffect(() => {
        let goal_weight = -1;
        let current_weight = -1;
        let start_weight;
        if (diet&&diet.array) {
            diet.array.forEach(element => {
                if (element.achievement.weight) start_weight = element.achievement.weight;
                if (goal_weight == -1 && element.achievement.goal_weight) goal_weight = element.achievement.goal_weight;
                if (current_weight == -1 && element.achievement.weight) current_weight = element.achievement.weight
            });
            setPercentage(((start_weight - current_weight) / ((start_weight - goal_weight)+0.01) * 100));
            setGoalWeight(goal_weight);
            setStartWeight(start_weight);
        }
    }, [diet]);

    return (
        <div className='WeightBar-container'>
            <h3>체중 목표</h3>
            <div className="weight-bar">
                <div className='per'>{percentage}%</div>
                <div className="bar">
                    <div className="bar-progress" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className='suchi'>
                    <span>{startweight}kg</span>
                    <span>{goalweight}kg</span>
                </div>
            </div>
        </div>
    );
}

export default WeightBar;