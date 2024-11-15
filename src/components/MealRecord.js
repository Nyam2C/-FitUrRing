import React, { useState } from 'react';
import styled from 'styled-components';

const Header = styled.div`
    display: flex;
    align-items: left;
    background-color: #ffffff;
    margin: 10px;
    width: 98%;
    height: 41%;
    .datelist {
        overflowY: scroll;
        maxHeight: 200px;
        flex: 1;
        .list {
            list-style-type: none;
            padding: 5px;
            li {
                text-align: center;
                padding: 5px;
                cursor: pointer;
            }
        }
    }
    .record {
        padding: 10px;
        table {
            width: 400px;
            height: 80%;
            border-collapse: collapse;
        }
        th,
        td {
            font-size : 15px;
            padding: 8px;
            text-align: center;
            border-bottom: none;
        }

    }
    .input {
        padding: 10px;
        width: 480px ;
        .detail {
            display: flex;
            alignItems: center;
            margin-top: 5px;
            input{
                width: 15%; 
                height: 20px;
                marginLeft: 10px;
                marginRight: 5px;
            }
            button{
                width: 50px;
                marginLeft: 10px;
                color: red;
                border: none;
            }
        }
        button{
            marginLeft: 10px;
            border: none;
        }
    }
    .mini {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 5%;
        left: 20%;
        padding: 80px;
        background: white;
        border: 1px solid #ddd;
        boxShadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        ul{
            height: 200px; 
            width: 500px;
            padding: 0px;
            overflow-y: auto;
            border: 2px solid #ddd;
            list-style-type: none;
            li {
                padding-left: 0px;
                border: 1px solid #ddd;
            }
        }
    }
`;

const recordedData = {
    "2024-11-01": {
        breakfast: [
            { food: "계란", calories: 70, carbs: 1, protein: 6, fat: 5 },
            { food: "밥", calories: 300, carbs: 68, protein: 6, fat: 0.5 }
        ],
        lunch: [
            { food: "닭가슴살", calories: 120, carbs: 0, protein: 23, fat: 2 }
        ],
        dinner: [
            { food: "사과", calories: 80, carbs: 21, protein: 0.5, fat: 0.3 }
        ]
    },
    "2024-11-02": {
        breakfast: [
            { food: "토스트", calories: 150, carbs: 27, protein: 4, fat: 3 },
            { food: "우유", calories: 100, carbs: 12, protein: 8, fat: 4 }
        ],
        lunch: [
            { food: "삼겹살", calories: 400, carbs: 0, protein: 20, fat: 35 }
        ],
        dinner: [
            { food: "샐러드", calories: 50, carbs: 5, protein: 1, fat: 0.5 }
        ]
    },
    "2024-11-03": {
        breakfast: [
            { food: "시리얼", calories: 200, carbs: 45, protein: 6, fat: 2 }
        ],
        lunch: [
            { food: "볶음밥", calories: 500, carbs: 60, protein: 10, fat: 20 }
        ],
        dinner: [
            { food: "고구마", calories: 120, carbs: 30, protein: 1, fat: 0 }
        ]
    },
    "2024-11-04": {
        breakfast: [
            { food: "베이글", calories: 250, carbs: 50, protein: 9, fat: 1 },
            { food: "크림치즈", calories: 100, carbs: 2, protein: 2, fat: 10 }
        ],
        lunch: [
            { food: "김밥", calories: 300, carbs: 40, protein: 8, fat: 5 }
        ],
        dinner: [
            { food: "미역국", calories: 50, carbs: 4, protein: 2, fat: 1 }
        ]
    },
    "2024-11-05": {
        breakfast: [
            { food: "오트밀", calories: 150, carbs: 27, protein: 5, fat: 3 },
            { food: "바나나", calories: 90, carbs: 23, protein: 1, fat: 0.3 }
        ],
        lunch: [
            { food: "라면", calories: 500, carbs: 80, protein: 10, fat: 15 }
        ],
        dinner: [
            { food: "돼지고기", calories: 250, carbs: 0, protein: 18, fat: 20 }
        ]
    },
    "2024-11-06": {
        breakfast: [
            { food: "빵", calories: 160, carbs: 30, protein: 4, fat: 3 }
        ],
        lunch: [
            { food: "햄버거", calories: 600, carbs: 45, protein: 25, fat: 30 }
        ],
        dinner: [
            { food: "오렌지", calories: 60, carbs: 15, protein: 1, fat: 0 }
        ]
    },
    "2024-11-07": {
        breakfast: [
            { food: "커피", calories: 10, carbs: 0, protein: 0, fat: 0 },
            { food: "도넛", calories: 250, carbs: 35, protein: 4, fat: 10 }
        ],
        lunch: [
            { food: "스파게티", calories: 450, carbs: 60, protein: 12, fat: 15 }
        ],
        dinner: [
            { food: "두부조림", calories: 100, carbs: 5, protein: 8, fat: 5 }
        ]
    },
    "2024-11-08": {
        breakfast: [
            { food: "요거트", calories: 120, carbs: 20, protein: 8, fat: 3 },
            { food: "견과류", calories: 100, carbs: 5, protein: 3, fat: 9 }
        ],
        lunch: [
            { food: "피자", calories: 500, carbs: 50, protein: 20, fat: 25 }
        ],
        dinner: [
            { food: "연어구이", calories: 200, carbs: 0, protein: 25, fat: 10 }
        ]
    },
    "2024-11-09": {
        breakfast: [
            { food: "핫케이크", calories: 300, carbs: 40, protein: 5, fat: 10 }
        ],
        lunch: [
            { food: "초밥", calories: 400, carbs: 50, protein: 10, fat: 5 }
        ],
        dinner: [
            { food: "된장국", calories: 60, carbs: 6, protein: 3, fat: 1 }
        ]
    },
    "2024-11-10": {
        breakfast: [
            { food: "토스트", calories: 180, carbs: 30, protein: 5, fat: 4 }
        ],
        lunch: [
            { food: "볶음우동", calories: 450, carbs: 70, protein: 8, fat: 12 }
        ],
        dinner: [
            { food: "야채샐러드", calories: 60, carbs: 10, protein: 2, fat: 1 }
        ]
    }
};


const foodOptions = [
    { name: "계란", calories: 70, carbs: 1, protein: 6, fat: 5 },
    { name: "밥", calories: 300, carbs: 68, protein: 6, fat: 0.5 },
    { name: "닭가슴살", calories: 120, carbs: 0, protein: 23, fat: 2 },
    { name: "사과", calories: 80, carbs: 21, protein: 0.5, fat: 0.3 },
    { name: "고구마", calories: 86, carbs: 20, protein: 1.6, fat: 0.1 },
    { name: "바나나", calories: 89, carbs: 23, protein: 1.1, fat: 0.3 },
    { name: "오렌지", calories: 62, carbs: 15, protein: 1.2, fat: 0.2 },
    { name: "소고기", calories: 250, carbs: 0, protein: 26, fat: 17 },
    { name: "돼지고기", calories: 242, carbs: 0, protein: 27, fat: 14 },
    { name: "고등어", calories: 189, carbs: 0, protein: 20, fat: 12 },
    { name: "연어", calories: 206, carbs: 0, protein: 22, fat: 13 },
    { name: "두부", calories: 76, carbs: 1.9, protein: 8, fat: 4.8 },
    { name: "김치", calories: 33, carbs: 6.1, protein: 1.1, fat: 0.2 },
    { name: "우유", calories: 42, carbs: 5, protein: 3.4, fat: 1 },
    { name: "요거트", calories: 59, carbs: 3.6, protein: 10, fat: 0.4 },
    { name: "치킨", calories: 239, carbs: 0, protein: 27, fat: 14 },
    { name: "고추", calories: 40, carbs: 9, protein: 2, fat: 0.4 },
    { name: "양파", calories: 40, carbs: 9, protein: 1.1, fat: 0.1 },
    { name: "당근", calories: 41, carbs: 10, protein: 0.9, fat: 0.2 },
    { name: "감자", calories: 77, carbs: 17, protein: 2, fat: 0.1 },
    { name: "브로콜리", calories: 34, carbs: 7, protein: 2.8, fat: 0.4 },
    { name: "호박", calories: 26, carbs: 6.5, protein: 1, fat: 0.1 },
    { name: "치즈", calories: 402, carbs: 1.3, protein: 25, fat: 33 },
    { name: "햄", calories: 145, carbs: 1.3, protein: 20, fat: 7 },
    { name: "소시지", calories: 301, carbs: 2, protein: 11, fat: 28 },
    { name: "초콜릿", calories: 546, carbs: 61, protein: 4.9, fat: 31 },
    { name: "아몬드", calories: 576, carbs: 21, protein: 21, fat: 49 },
    { name: "땅콩", calories: 567, carbs: 16, protein: 25, fat: 49 },
    { name: "식빵", calories: 265, carbs: 49, protein: 9, fat: 3.2 },
    { name: "파스타", calories: 131, carbs: 25, protein: 5, fat: 1.1 },
];


function MealRecord() {
    const [data, setData] = useState(recordedData);
    const [selectedDate, setSelectedDate] = useState("2024-11-01");
    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [total, setTotal] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
    const [foodWeight, setFoodWeight] = useState(100);

    const handleSelectDate = (date) => setSelectedDate(date);
    const handleSelectMeal = (meal) => setSelectedMeal(meal);

    const handleFoodChange = (meal, index, newFood) => {
        const selectedFood = foodOptions.find((food) => food.name === newFood);
        setData((prevData) => {
            const updatedMeal = prevData[selectedDate][meal].map((item, idx) =>
                idx === index ? { ...selectedFood } : item
            );
            return {
                ...prevData,
                [selectedDate]: { ...prevData[selectedDate], [meal]: updatedMeal },
            };
        });
    };

    // 음식 추가
    const handleAddFood = () => {
        if (selectedFood && foodWeight > 0) {
            const scaledFood = {
                ...selectedFood,
                food: selectedFood.name,
                calories: (selectedFood.calories * foodWeight) / 100,
                carbs: (selectedFood.carbs * foodWeight) / 100,
                protein: (selectedFood.protein * foodWeight) / 100,
                fat: (selectedFood.fat * foodWeight) / 100,
            };
            setData((prevData) => {
                const updatedMeal = [...prevData[selectedDate][selectedMeal], scaledFood];
                return {
                    ...prevData,
                    [selectedDate]: { ...prevData[selectedDate], [selectedMeal]: updatedMeal },
                };
            });
            setIsModalOpen(false);
            setSearchQuery("");
            setFoodWeight(100);
            setSelectedFood(null);
        }
    };

    const handleDeleteFood = (meal, index) => {
        setData((prevData) => {
            const updatedMeal = prevData[selectedDate][meal].filter((_, idx) => idx !== index);
            return {
                ...prevData,
                [selectedDate]: { ...prevData[selectedDate], [meal]: updatedMeal },
            };
        });
    };

    const calculateTotal = (meal, nutrient) => {
        return data[selectedDate][meal].reduce((acc, item) => acc + item[nutrient], 0);
    };

    const calculateTotalSum = (nutrient) => {
        let total = 0;
        ["breakfast", "lunch", "dinner"].map((meal, index) => (
            total += calculateTotal(meal, nutrient)
        ))
        return total;
    };

    const filteredFoods = foodOptions.filter((food) =>
        food.name.includes(searchQuery)
    );

    // 음식 선택
    const handleSelectFood = (food) => {
        setSelectedFood(food);
    };


    return (
        <Header>
            <div className='datelist' style={{overflowY: 'scroll' }}>
                <ul className='list'>
                    {Object.keys(data).map((date) => (
                        <li
                            key={date}
                            onClick={() => handleSelectDate(date)}
                            style={{
                                backgroundColor: date === selectedDate ? '#eee' : 'transparent',
                            }}
                        >
                            {date}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='record' style={{ borderLeft: '1px solid #ddd' }}>
                <p><strong>{selectedDate} 식사 기록</strong></p>
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
                        {["breakfast", "lunch", "dinner"].map((meal, index) => (
                            <tr key={index} onClick={() => handleSelectMeal(meal)} style={{ cursor: 'pointer' }}>
                                <td>{meal === "breakfast" ? "아침" : meal === "lunch" ? "점심" : "저녁"}</td>
                                <td>{calculateTotal(meal, 'calories')} kcal</td>
                                <td>{calculateTotal(meal, 'carbs')} g</td>
                                <td>{calculateTotal(meal, 'protein')} g</td>
                                <td>{calculateTotal(meal, 'fat')} g</td>
                            </tr>
                        ))}
                        <tr>
                            <td>총합</td>
                            <td> {calculateTotalSum('calories')} kcal</td>
                            <td> {calculateTotalSum('carbs')} g</td>
                            <td> {calculateTotalSum('protein')} g</td>
                            <td> {calculateTotalSum('fat')} g</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {selectedMeal && (
                <div className='input' style={{ borderLeft: '1px solid #ddd' }}>
                    <h3>기록 하기</h3>
                    {data[selectedDate][selectedMeal].map((item, index) => (
                        <div key={index} className='detail'>
                            <input value={item.food} readOnly />
                            <input type="number" value={item.calories} readOnly />  kcal
                            <input type="number" value={item.carbs} readOnly />  g
                            <input type="number" value={item.protein} readOnly />  g
                            <input type="number" value={item.fat} readOnly />  g
                            <button onClick={() => handleDeleteFood(selectedMeal, index)} >삭제</button>
                        </div>
                    ))}
                    <button onClick={() => setIsModalOpen(true)} style={{ marginTop: '10px', color: '#007bff' }}>+ 음식 추가</button>
                </div>
            )}
            {isModalOpen && (
                <div className='mini'>
                    <h4>음식 검색</h4>
                    <input
                        type="text"
                        placeholder="음식 이름"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ul className="list">
                        {filteredFoods.map((food, index) => (
                            <li key={index} onClick={() => handleSelectFood(food)} style={{ cursor: 'pointer' }}>
                                {food.name}
                            </li>
                        ))}
                    </ul>
                    {selectedFood && (
                        <div>
                            <p>선택: {selectedFood.name}</p>
                            <input
                                type="number"
                                placeholder="무게 (g)"
                                value={foodWeight}
                                onChange={(e) => setFoodWeight(Number(e.target.value))}
                            /> g
                            <button onClick={handleAddFood}>추가</button>
                        </div>
                    )}
                    <button onClick={() => setIsModalOpen(false)}>닫기</button>
                </div>
            )}

        </Header>
    );
}

export default MealRecord;
