import React, { useState } from 'react';
import './Checkactivity.css';

function Checkactivity({ onButtonClick }) {
    const [activeButton, setActiveButton] = useState(null); // 클릭한 버튼의 인덱스 저장

    const handleClick = (index) => {
        setActiveButton(index); // 클릭한 버튼의 인덱스를 저장
        onButtonClick(index);  // 부모 컴포넌트의 클릭 핸들러 호출
    };

    return (
        <div id="activity-container">
            {Array.from({ length: 5 }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => handleClick(i + 1)}
                    style={{
                        backgroundColor: i+1 === activeButton ? '#eee' : 'transparent',
                    }}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
}

export default Checkactivity;
