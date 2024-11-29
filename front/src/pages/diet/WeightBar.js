import styled from 'styled-components';
import React, { useState } from 'react';

const Header = styled.div`
    h3 {
        margin: 10px;
        text-align: left;
    }
    .weight-bar {
        display: flex;
        align-items: center;
        width: 325px;
        height: 50px;
        background-color: #eeeeee;
        position: relative;
    }
    .bar {
        position: absolute;
        top: 40%;
        left: 11%;
        height: 10px;
        width: 250px;
        background-color: #ddd;
    }
    .bar-progress {
        height: 100%;
        width: 10px;
        background-color: #4AA1FF;
        border-radius: 5px;
    }
`;

function WeightBar({ diet }) {
    const percentage = ((diet.start_weight - diet.current_weight) / (diet.start_weight - diet.goal_weight) * 100);

    return (
        <Header>
            <h3>체중 목표</h3>
            <div className="weight-bar">
                {percentage}%
                <div className="bar">
                    <div className="bar-progress" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </Header>
    );
}

export default WeightBar;