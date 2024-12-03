import React, { useState } from 'react';
import './NutrientDisplay.css';

function NutrientDisplay({ user, bmr, diet }) {
    return (
        <div className='NutrientDisplay-container'>
            <h1>식단 가이드</h1>
            <div className="nutrient-goals">
                <div className="side">
                    <p><strong>끼니당</strong> 영양소</p>
                    <p> 섭취목표</p>
                </div>
                <div className="nutrients">
                    <div><span className="carbs">탄수화물</span> <div><span className="num">{Math.round(bmr * 0.5 / 4)}</span>g</div></div>
                    <div><span className="protein">단백질</span> <div><span className="num">{Math.round(bmr * 0.5 / 4)}</span>g</div></div>
                    <div><span className="fat">지방</span> <div><span className="num">{Math.round(bmr * 0.5 / 9)}</span>g</div></div>
                </div>
            </div>
        </div>
    );
}

export default NutrientDisplay;