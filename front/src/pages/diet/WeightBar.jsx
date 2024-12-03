import React, { useState } from 'react';
import './WeightBar.css'

function WeightBar({ diet }) {
    const percentage = ((diet.start_weight - diet.current_weight) / (diet.start_weight - diet.goal_weight) * 100);

    return (
        <div className='WeightBar-container'>
            <h3>체중 목표</h3>
            <div className="weight-bar">
                <div className='per'>{percentage}%</div>
                <div className="bar">
                    <div className="bar-progress" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className='suchi'>
                    <span>60kg</span>
                    <span>70kg</span>
                </div>
            </div>
        </div>
    );
}

export default WeightBar;