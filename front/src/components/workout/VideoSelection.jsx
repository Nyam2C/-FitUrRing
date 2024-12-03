import React, { useState, useEffect, useReducer, useRef } from 'react';

import SelectBtn from './SelectBtn';

function videoReducer(videos, action){
    switch (action.type){
            //백엔드에서 필터링된 영상 보내주기
            //한페이지당 30개씩 표시, 처음에는 60개씩 가져옴(useEffect)
            //더보기 누르면 새로운 정보 30개 받아오기
        case 'tag': {
            return videos.filter((t) => t.tags.indexOf(action.tag) !== -1);
        }
        case 'time': {
            return videos.filter((t) => t.time<action.end && t.time>action.start);
        }
        default:{
            throw Error('Unknown action: ' + action.type);
        }
    }
}


function VideoSelection({setSelected}){
    const [warning, setWarning] = useState();
    const [page, setPage] = useState(1);
    const [videos, dispatch] = useReducer(videoReducer, []);
    const [searchTags, setSearchTags] = useState('');
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    useEffect(() => {
        console.log(searchTags);
        dispatch({
            type: 'tag',
            tag: searchTags,
        });
    }, [searchTags]);

    useEffect(() => {
        console.log(start, end);
        if (start && end && start > end){
            setWarning("시작 시간은 종료 시간보다 클 수 없습니다");
        }
        else{
            setWarning();
        }
        dispatch({
            type: 'time',
            start: start,
            end: end,
        });
    }, [start, end]);

    function handleAddTag(e){
        setSelected(e);
        const newTags = (searchTags)?searchTags+'|'+`${e}`:`${e}`;
        setSearchTags(newTags);
        setPage(1);
    }
    function handleDelTag(e){
        setSelected(e);
        const newTags = searchTags.replace(e, '');
        setSearchTags(newTags);
        setPage(1);
    }
    function handleTime(e){
 
        dispatch({
            type: 'time',
            start: parseInt(start),
            end: parseInt(end),
        })
        setPage(1);
        console.log(start, ' ', end);
    }

    return (
        <div id="videoSelection" className="col center">
                <div className='col padding'>
                    <h3>난이도</h3>
                    <label>상
                        <SelectBtn type="radio" value="advanced" name="level" onAdd={handleAddTag} onDelete={handleDelTag}></SelectBtn>
                    </label>
                    <label>하 
                        <SelectBtn type="radio" value="beginner" name="level" onAdd={handleAddTag} onDelete={handleDelTag}></SelectBtn>
                    </label>
                </div>
                <div id="timeSelection" className="col center padding">
                    <h3>시간</h3>
                    <span> From: </span>
                    <input type="number" name="start" onChange={(e)=>(setStart(e.target.value))}></input>
                    <span> To:  </span>
                    <input type="number" name="end" onChange={(e)=>(setEnd(e.target.value))}></input>
                    {warning?<p>{warning}</p>:null}
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