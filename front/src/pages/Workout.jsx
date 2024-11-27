import React, { useState, useEffect } from 'react';

import Resizable from '../components/Resizable';
import RadioGroup from '../components/RadioGroup';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const data = {
    asdf: 'this is ~'
}
const videoData = [
    {
        video_id: 0,
        video_title: 'ｖｉｄｅｏ ０１',
        by: 'youtuber1',
        liked: 0,
    },
    {
        video_id: 1,
        video_title: 'ｖｉｄｅｏ０２',
        by: 'youtuber2',
        liked: 0,
    },
    {
        video_id: 2,
        video_title: 'ｖｉｄｅｏ０5',
        by: 'youtuber2',
        liked: 0,
    },
    {
        video_id: 3,
        video_title: 'ｖｉｄｅｏ０6',
        by: 'youtuber2',
        liked: 0,
    },
    {
        video_id: 4,
        video_title: 'ｖｉｄｅｏ０7',
        by: 'youtuber2',
        liked: 0,
    },
]

function VideoSelection(){

    return (
        <div id="inputs">
            <form>
                <RadioGroup mode="exclusive" label="난이도">
                    <label>상</label>
                    <input type="radio" value="advanced" name="advanced" />
                    <label>하</label>
                    <input type="radio" value="beginner" name="beginner" />
                </RadioGroup>
                <RadioGroup>
                    <label>팔</label>
                    <input type="radio" value="arms" name="arms" />
                    <label>가슴</label>
                    <input type="radio" value="chest" name="chest" />
                    <label>등</label>
                    <input type="radio" value="back" name="back" />
                    <label>어깨</label>
                    <input type="radio" value="shoulders" name="shoulders" />
                    <label>복근</label>
                    <input type="radio" value="abs" name="abs" />
                    <label>허벅지</label>
                    <input type="radio" value="thigh" name="thigh" />
                    <label>엉덩이</label>
                    <input type="radio" value="glutes" name="glutes" />
                    <label>전신</label>
                    <input type="radio" value="fullbody" name="fullbody" />
                    <label>유산소</label>
                    <input type="radio" value="cardio" name="cardio" />
                </RadioGroup>
            </form>
        </div>

    );
}
function Explains({data, selected}){
    //conditional Rendering -> handleClick에서 들어온 input의 처리결과 띄우기
    //h1으로 제목
    //p로 설명
    return (
        <div id="explains">
            <h1>{selected}</h1>
            <p>{data[selected]}</p>  
        </div>

    );
}
function VideoLists({data}){
    console.log(data);
    //블록 return 
    return (
        <div id="videoLists">
            {data.map((item) => (
                <div id="videoBlock">
                    <h3>{item.video_title}</h3>
                    <p>{item.by}</p>
                    <p className='flex-end'>
                    <FontAwesomeIcon icon={faHeart} />
                    {' '+item.liked}</p>
                </div>
            ))}
        </div>
    );
}

function Workout(){
    const [selected, setSelected] = useState();
    
    function handleClick(e){
        setSelected(e.target.id);
    }

    return (
        <div id="workout">
                <VideoSelection />
            <div id="muscles">
                <h3 id='asdf' onClick={handleClick}>images here</h3>
            </div>
                <div id="searchResults">
                    <Explains 
                    data={data}
                    selected={selected}    
                    />
                    <VideoLists
                    data={videoData}
                    />
                </div>
        </div>
    );
}

export default Workout;