import React, { useState, useEffect } from 'react';
import './MealRecord.css'
import { createDiet, deleteDiet, getFoodData } from './api';

function MealRecord({ diet }) {
    const [data, setData] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
    const [foodWeight, setFoodWeight] = useState(100);
    const [dateList, setDateList] = useState([]);
    const [foodData, setFoodData] = useState([]);

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        if (!data[date]) {
            setData(prevData => ({
                ...prevData,
                [date]: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                }
            }));
        }
    };
    const handleSelectMeal = (meal) => setSelectedMeal(meal);

    const getTodayDate = (date) => {
        const kstDate = new Date(date);
        kstDate.setHours(kstDate.getHours() + 9); // UTC+9
        return kstDate.toISOString().split('T')[0];
    };

    const fetchFoodData = async (query = "") => {
        try {
            const foods = await getFoodData(query);
            setFoodData(foods);
        } catch (error) {
            console.error("Error fetching food data:", error);
        }
    };

    useEffect(() => {
        const generateDateList = () => {
            const dates = [];
            const today = new Date();
            today.setHours(today.getHours() + 9); // KST로 설정
            const initialData = {};

            for (let i = 0; i < 14; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const formattedDate = date.toISOString().split('T')[0];
                dates.push(formattedDate);
                
                if (!data[formattedDate]) {
                    initialData[formattedDate] = {
                        breakfast: [],
                        lunch: [],
                        dinner: []
                    };
                }
            }
            
            setDateList(dates);
            setData(prevData => ({
                ...prevData,
                ...initialData
            }));
        };

        generateDateList();
        fetchFoodData();
    }, []);

    useEffect(() => {
        if (diet?.diets) {
            const newData = {};
            
            diet.diets.forEach(dietItem => {
                const formattedDate = new Date(dietItem.date).toISOString().split('T')[0];
                
                newData[formattedDate] = {
                    breakfast: dietItem.meals.breakfast.map(meal => ({
                        ...meal,
                        food_id: meal.food_id,
                        grams: meal.grams
                    })) || [],
                    lunch: dietItem.meals.lunch.map(meal => ({
                        ...meal,
                        food_id: meal.food_id,
                        grams: meal.grams
                    })) || [],
                    dinner: dietItem.meals.dinner.map(meal => ({
                        ...meal,
                        food_id: meal.food_id,
                        grams: meal.grams
                    })) || []
                };
            });
            
            setData(prevData => ({
                ...prevData,
                ...newData
            }));

            if (diet.diets.length > 0 && !selectedDate) {
                const firstDate = new Date(diet.diets[0].date).toISOString().split('T')[0];
                setSelectedDate(firstDate);
            }
        }
    }, [diet, foodData]);

    const handleAddFood = async () => {
        if (!selectedFood || foodWeight <= 0) {
            alert("음식을 선택하고 적절한 무게를 입력하세요.");
            return;
        }

        try {
            const response = await createDiet({
                date: selectedDate,
                mealtime: selectedMeal,
                food_id: selectedFood.food_id,
                grams: foodWeight
            });

            if (response) {
                const newFoodItem = {
                    food_id: selectedFood.food_id,
                    grams: foodWeight,
                    foodInfo: selectedFood
                };

                setData(prevData => ({
                    ...prevData,
                    [selectedDate]: {
                        ...prevData[selectedDate],
                        [selectedMeal]: [
                            ...prevData[selectedDate][selectedMeal],
                            newFoodItem
                        ]
                    }
                }));

                setIsModalOpen(false);
                setSearchQuery("");
                setFoodWeight(100);
                setSelectedFood(null);
            }
        } catch (err) {
            alert(err);
        }
    };

    const handleDeleteFood = async (meal, index) => {
        try {
            const foodToDelete = data[selectedDate][meal][index];
            
            await deleteDiet({
                date: selectedDate,
                mealtime: meal,
                food_id: foodToDelete.food_id
            });

            setData(prevData => ({
                ...prevData,
                [selectedDate]: {
                    ...prevData[selectedDate],
                    [meal]: prevData[selectedDate][meal].filter((_, i) => i !== index)
                }
            }));
        } catch (err) {
            console.error('Delete error:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const calculateTotal = (meal, nutrient) => {
        if (!selectedDate || !data[selectedDate] || !data[selectedDate][meal]) return 0;
        
        return data[selectedDate][meal].reduce((acc, item) => {
            if (!item.foodInfo) return acc;
            const value = nutrient === 'calories' ? item.foodInfo.energy_kcal : item.foodInfo[nutrient];
            return acc + (value * item.grams / 100);
        }, 0);
    };

    const calculateTotalSum = (nutrient) => {
        if (!selectedDate) return 0;
        
        return ["breakfast", "lunch", "dinner"].reduce((total, meal) => {
            return total + calculateTotal(meal, nutrient);
        }, 0);
    };

    const filteredFoods = foodData.filter(food =>
        food.food_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectFood = (food) => {
        setSelectedFood(food);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className='MealRecord-container'>
            <div className='datelist' style={{ overflowY: 'scroll' }}>
                <ul className='list'>
                    {dateList.map((date) => (
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
            <div className='record'>
                <span>{selectedDate ? `${selectedDate} 식사 기록` : '날짜를 선택하세요'}</span>
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
                    {selectedDate && <tbody>
                        {["breakfast", "lunch", "dinner"].map((meal, index) => (
                            <tr key={index} onClick={() => handleSelectMeal(meal)} style={{ cursor: 'pointer' }}>
                                <td className='mealtime' style={{
                                    backgroundColor: meal === selectedMeal ? '#eee' : 'transparent',
                                }}><strong>{meal === "breakfast" ? "아침" : meal === "lunch" ? "점심" : "저녁"}</strong></td>
                                <td>{calculateTotal(meal, 'calories').toFixed(1)} kcal</td>
                                <td>{calculateTotal(meal, 'carbs').toFixed(1)} g</td>
                                <td>{calculateTotal(meal, 'protein').toFixed(1)} g</td>
                                <td>{calculateTotal(meal, 'fat').toFixed(1)} g</td>
                            </tr>
                        ))}
                        <tr>
                            <td><strong>총합</strong></td>
                            <td> {calculateTotalSum('calories').toFixed(1)} kcal</td>
                            <td> {calculateTotalSum('carbs').toFixed(1)} g</td>
                            <td> {calculateTotalSum('protein').toFixed(1)} g</td>
                            <td> {calculateTotalSum('fat').toFixed(1)} g</td>
                        </tr>
                    </tbody>
                    }
                </table>
            </div>

            {(selectedDate && selectedMeal) && (
                <div className='input'>
                    <span>기록 하기</span>
                    <div className='detail'>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th>음식</th>
                                    <th>칼로리</th>
                                    <th>탄수화물</th>
                                    <th>단백질</th>
                                    <th>지방</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data[selectedDate] && data[selectedDate][selectedMeal].map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.foodInfo 
                                                ? `${item.foodInfo.food_name} (${item.grams}g)` 
                                                : `음식 ID: ${item.food_id} (${item.grams}g)`}
                                        </td>
                                        <td>
                                            {item.foodInfo 
                                                ? (item.grams * item.foodInfo.energy_kcal / 100).toFixed(1) 
                                                : '정보 없음'} kcal
                                        </td>
                                        <td>
                                            {item.foodInfo 
                                                ? (item.grams * item.foodInfo.carbs / 100).toFixed(1) 
                                                : '정보 없음'} g
                                        </td>
                                        <td>
                                            {item.foodInfo 
                                                ? (item.grams * item.foodInfo.protein / 100).toFixed(1) 
                                                : '정보 없음'} g
                                        </td>
                                        <td>
                                            {item.foodInfo 
                                                ? (item.grams * item.foodInfo.fat / 100).toFixed(1) 
                                                : '정보 없음'} g
                                        </td>
                                        <button onClick={() => handleDeleteFood(selectedMeal, index)}>삭제</button>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className='mealregi' onClick={() => setIsModalOpen(true)}>+ 음식 추가</button>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className='mini'>
                            <h4>음식 검색</h4>
                            <input
                                type="text"
                                placeholder="음식 이름을 입력하세요"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <ul className="list">
                                {filteredFoods.map((food) => (
                                    <li 
                                        key={food.food_id} 
                                        onClick={() => handleSelectFood(food)} 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {food.food_name} ({food.energy_kcal}kcal/100g)
                                    </li>
                                ))}
                            </ul>
                            <div className='under'>
                                {selectedFood && (
                                    <div>
                                        <p>선택한 음식: {selectedFood.food_name}</p>
                                        <p>100g 당 영양성분:</p>
                                        <p>칼로리: {selectedFood.energy_kcal}kcal</p>
                                        <p>탄수화물: {selectedFood.carbs}g</p>
                                        <p>단백질: {selectedFood.protein}g</p>
                                        <p>지방: {selectedFood.fat}g</p>
                                        <input
                                            type="number"
                                            placeholder="섭취량 (g)"
                                            value={foodWeight}
                                            onChange={(e) => setFoodWeight(Number(e.target.value))}
                                            min="0"
                                        /> g
                                    </div>
                                )}
                                <div>
                                    {selectedFood && (
                                        <button onClick={handleAddFood}>추가</button>
                                    )}
                                    <button onClick={() => {
                                        setIsModalOpen(false);
                                        setSearchQuery('');
                                        setSelectedFood(null);
                                        setFoodWeight(100);
                                    }}>닫기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MealRecord;
