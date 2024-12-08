import React, { useState, useEffect, useRef } from 'react';

import SelectBtn from './SelectBtn';

function VideoSelection({dispatch, setSelected}){
    const [warning, setWarning] = useState();

    const [startMin, setStartMin] = useState(null);
    const [endMin, setEndMin] = useState(null);
    const [startSec, setStartSec] = useState(null);
    const [endSec, setEndSec] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);

    const tagRef = useRef([]);
    
    useEffect(() => {
        if (startSec || endSec || startMin || endMin){
            if (startMin > endMin || (startMin===endMin && startSec>endSec)){
                setWarning("시작 시간은 종료 시간보다 클 수 없습니다");
            }
            else{
                setWarning(null);
            }
            dispatch({
                type: 'time',
                start: `${startMin}:${startSec}`,
                end: `${endMin}:${endSec}`,
            });
            }
    }, [startSec, endSec, startMin, endMin]);

    function handleAddTag(e){
        setSelected(e);
        const newTag = [...tagRef.current, e];
        tagRef.current = newTag;
        dispatch({
            type: 'tag',
            tag: tagRef.current,
        });
    }
    function handleDelTag(e){
        setSelected(e);
        const newTag = tagRef.current.filter((t) => t !== e);
        tagRef.current = newTag;
        dispatch({
            type: 'tag',
            tag: tagRef.current,
        });
    }
    function handleLevel(e){
        if(currentLevel === e.target.value){
            setCurrentLevel(null);
        } else {
            setCurrentLevel(e.target.value);
            dispatch({
                type: 'level',
                level: currentLevel,
            });
        }
    }
    function handleChange(e){
        if (e.target.name === 'startMin')   setStartMin(e.target.value?e.target.value:null);
        if (e.target.name === 'startSec')   setStartMin(e.target.value?e.target.value:null);
        if (e.target.name === 'endMin')   setStartMin(e.target.value?e.target.value:1440);
        if (e.target.name === 'endSec')   setStartMin(e.target.value?e.target.value:null);
    }

    return (
        <div id="videoSelection" className="col center">
                <div className='col padding'>
                    <h3>난이도</h3>
                    <label>상
                        <input type="radio" value="advanced" name="level" onClick={handleLevel} checked={currentLevel === 'advanced'} ></input>
                    </label>
                    <label>하 
                        <input type="radio" value="beginner" name="level" onClick={handleLevel} checked={currentLevel === 'beginner'}></input>
                    </label>
                </div>
                <div id="timeSelection" className="col center padding">
                    <h3>시간</h3>
                    <span> 
                    <input type="number" name="startMin" onChange={handleChange} min={0}></input>
                    {/* <input type="number" name="start"  value={startMin !== null ? startMin : ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setStartMin(value === "" ? null : parseInt(value, 10));
                    }}></input> */}
                    <span> 분</span>
                    <input type="number" name="start" onChange={(e) => e.target.value === 0 ? setStartSec(null) : setStartSec(e.target.value)} min={0}></input>
                    <span> 초</span>
                    </span>
                    <span> ~
                    <input type="number" name="end" onChange={(e) => e.target.value === 1440 ? setEndMin(null) : setEndMin(e.target.value)} min={0}></input>
                    <span> 분 </span>
                    <input type="number" name="start" onChange={(e) => e.target.value === 0 ? setEndSec(null) : e.target.value} min={0}></input>
                    <span> 초</span>
                    </span>
                    <p>{warning}</p>
                </div>
                <div className="col center padding">
                    <h3>부위</h3>
                        <SelectBtn type="button" value="chest"  onAdd={handleAddTag} onDelete={handleDelTag}>가슴</SelectBtn>
                        <SelectBtn type="button" value="back"  onAdd={handleAddTag} onDelete={handleDelTag}>등</SelectBtn>
                        <SelectBtn type="button" value="shoulders"  onAdd={handleAddTag} onDelete={handleDelTag}>어깨</SelectBtn>
                        <SelectBtn type="button" value="abs"  onAdd={handleAddTag} onDelete={handleDelTag}>복근</SelectBtn>
                        <SelectBtn type="button" value="thighs"  onAdd={handleAddTag} onDelete={handleDelTag}>허벅지</SelectBtn>
                        <SelectBtn type="button" value="glutes"  onAdd={handleAddTag} onDelete={handleDelTag}>엉덩이</SelectBtn>
                        <SelectBtn type="button" value="fullbody"  onAdd={handleAddTag} onDelete={handleDelTag}>전신</SelectBtn>
                        <SelectBtn type="button" value="cardio"  onAdd={handleAddTag} onDelete={handleDelTag}>유산소</SelectBtn>
                </div>
        </div>

    );
}

export default VideoSelection;