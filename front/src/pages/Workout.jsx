import React, { useState, useEffect, useReducer, useRef } from 'react';

import Resizable from '../components/Resizable';
import RadioGroup from '../components/RadioGroup';
import VideoLists from '../components/VideoLists';
import VideoSelection from '../components/VideoSelection';
import Images from '../components/Images';


import {ReactComponent as Soleus} from '../assets/가자미근.svg';


const data = {
    asdf: 'this is'
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

function Workout(){
    const [selected, setSelected] = useState();
    
    function handleClick(e){
        setSelected(e.target.id);
    }

    return (
        <div id="workout">
                <VideoSelection setSelected={setSelected}/>
            <div id="muscles">
                {/* <h3 id='asdf' onClick={handleClick}>images here</h3> */}
                <Images selected={selected}/>
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