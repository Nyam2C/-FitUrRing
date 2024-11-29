import styled from 'styled-components';
import React, { useState } from 'react';

const Header = styled.div`
    h3 {
        font-weight: bold;
        text-align: left;
        margin: 10px;
    }
    .nutrient-goals {
        display: flex;
        align-items: center;
        background-color: #eeeeee;
        height: 60px;
        width: 325px;
    }
    .side {
        height: 30px;
        width: 100px;
        font-size: 12px;
        text-align: left;
        line-height: 0px;
        margin: 15px;
    }
    .nutrients {
        display: flex;
        gap: 15px;
        font-size: 14px;
        div {
            display: flex;
            flex-direction: column;
            text-align: left;
        }
    }
    .carbs {
        color: #E29165;
    }

    .protein {
        color: #EA5858;
    }

    .fat {
        color: #e579de;
    }

    .num {
        font-size: 20px;
    }
`;

function NutriendDisplay({ user, bmr, diet }) {
    return(
        <Header>
        <h3>식단 가이드</h3>
        <div className="nutrient-goals">
            <div className="side">
                <p><strong>끼니당</strong> 영양소</p><p> 섭취목표</p>
            </div>
            <div className="nutrients">
                <div><span className="carbs">탄수화물</span> <span className="num"><strong>{Math.round( bmr * 0.5 / 4 )}</strong>g</span></div>
                <div><span className="protein">단백질</span> <span className="num"><strong>{Math.round( bmr * 0.5 / 4 )}</strong>g</span></div>
                <div><span className="fat">지방</span> <span className="num"><strong>{Math.round( bmr * 0.5 / 9)}</strong>g</span></div>
            </div>
        </div>
    </Header>
    );
}

export default NutriendDisplay;