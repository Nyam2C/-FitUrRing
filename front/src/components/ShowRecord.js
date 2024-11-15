import styled from 'styled-components';
import React, { useState } from 'react';
import MealRecord from './MealRecord';

const Header = styled.div`
    display: flex;
    width: 1000px;
    height: 280px;
    gap: 5px;
`;


function ShowRecord({ onDateSelect, mealData, date, onSave, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editableMealData, setEditableMealData] = useState(mealData);
    const [meals, setMeals] = useState({});
    const [selectedDate, setSelectedDate] = useState("");

    const handleInputChange = (mealType, field, value) => {
        setEditableMealData({
            ...editableMealData,
            [mealType]: {
                ...editableMealData[mealType],
                [field]: parseInt(value, 10) || 0,
            },
        });
    };

    const handleSave = () => {
        onSave(editableMealData);  // 부모 컴포넌트에 저장 요청
        setIsEditing(false);       // 편집 모드 해제
    };

    const updateMealData = (date, updatedData) => {
        setMeals((prevMeals) => ({
            ...prevMeals,
            [date]: updatedData,
        }));
    };

    const deleteMealData = (date) => {
        const updatedMeals = { ...meals };
        delete updatedMeals[date];
        setMeals(updatedMeals);
        setSelectedDate("");  // 날짜 선택 해제
    };


    return (
        <Header>
            <MealRecord />
            <div className="history">
                <div className="date-list">
                    {Object.keys(meals).map((savedDate) => (
                        <div
                            key={savedDate}
                            onClick={() => onDateSelect(savedDate)}
                            className={`date-item ${selectedDate === savedDate ? "selected" : ""}`}
                        >
                            {savedDate}
                        </div>
                    ))}
                </div>
                {selectedDate && meals[selectedDate] && (
                    <div mealData={meals[selectedDate]}
                        date={selectedDate}
                        onSave={(updatedData) => updateMealData(selectedDate, updatedData)}
                        onDelete={() => deleteMealData(selectedDate)} className="meal-details">
                        <h3>{date}의 식사 정보</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>식사시간</th>
                                    <th>총 칼로리</th>
                                    <th>탄수화물</th>
                                    <th>단백질</th>
                                    <th>지방</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["breakfast", "lunch", "dinner"].map((mealType) => (
                                    <tr key={mealType}>
                                        <td>{mealType === "breakfast" ? "아침" : mealType === "lunch" ? "점심" : "저녁"}</td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editableMealData[mealType].calories}
                                                    onChange={(e) => handleInputChange(mealType, "calories", e.target.value)}
                                                />
                                            ) : (
                                                `${mealData[mealType].calories} kcal`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editableMealData[mealType].carbs}
                                                    onChange={(e) => handleInputChange(mealType, "carbs", e.target.value)}
                                                />
                                            ) : (
                                                `${mealData[mealType].carbs} g`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editableMealData[mealType].protein}
                                                    onChange={(e) => handleInputChange(mealType, "protein", e.target.value)}
                                                />
                                            ) : (
                                                `${mealData[mealType].protein} g`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editableMealData[mealType].fat}
                                                    onChange={(e) => handleInputChange(mealType, "fat", e.target.value)}
                                                />
                                            ) : (
                                                `${mealData[mealType].fat} g`
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="action-buttons">
                            {isEditing ? (
                                <button className="save-button" onClick={handleSave}>저장</button>
                            ) : (
                                <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
                            )}
                            <button className="delete-button" onClick={onDelete}>삭제</button>
                        </div>
                    </div>
                )}
            </div>
        </Header>
    );
}

export default ShowRecord;