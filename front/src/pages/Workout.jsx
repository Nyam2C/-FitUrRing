import React, { useState, useEffect, useReducer, useRef } from 'react';

import Resizable from '../components/Resizable';
import VideoLists from '../components/workout/VideoLists';
import VideoSelection from '../components/workout/VideoSelection';
import Images from '../components/workout/Images';
import ExerciseBlock from '../components/ExerciseBlock';

import { getEntireVideos, searchVideos} from '../api/workoutAPI';


function Explains({data, selected}){
    //conditional Rendering -> handleClick에서 들어온 input의 처리결과 띄우기
    //h1으로 제목
    //p로 설명
    return (
        <div id="explains">
            <h1>{selected}</h1>
            {/* <p>{data[selected]}</p>   */}
        </div>

    );
}


function Workout(){
    const initial = {       
        video_tag: [],
        video_time_from: 0,
        video_time_to: 0,
        video_level: '',
    }

    const [videos, setVideos] = useState([]);
    const [selected, setSelected] = useState();
    const [page, setPage] = useState(3);
    const [filter, dispatch] = useReducer(FilterReducer, initial);
    
    useEffect(() => {
            fetchEntireVideos();
        }, [])

    const fetchEntireVideos = async () => { 
        try{
            const data = await getEntireVideos(page);
            console.log(data.videos);
            //처음 받은 데이터를 필터링 해서 보여주고, 더보기를 누르면 백에게 필터링 정보 요청
            const newVideos = [...videos, ...data.videos];
            setVideos(newVideos);            
        } catch (error) {
            console.error(error.message);
        }
    }
    console.log(videos);
    //filter에 따라서 필터링된 data를 제공
    //더보기 버튼 누르면 API호출
    function FilterReducer(filter, action){
        switch (action.type){
                //백엔드에서 필터링된 영상 보내주기
                //한페이지당 30개씩 표시, 처음에는 60개씩 가져옴(useEffect)
                //더보기 누르면 새로운 정보 30개 받아오기
            case 'tag': {
                const newFilter = {...filter, video_tag: action.tag};
                return newFilter;
                break;
                //return videos.filter((t) => t.tags.indexOf(action.tag) !== -1);
            }
            case 'time': {
                const newFilter = {...filter, video_time_from: action.start, video_time_to: action.end};
                return newFilter;
                break;
                //return videos.filter((t) => t.time<action.end && t.time>action.start);
            }
            case 'level':{
                const newFilter = {...filter, video_level: action.level};
                return newFilter;
                break;
            }
            default:{
                throw Error('Unknown action: ' + action.type);
            }
        }
    }
    
    return (
        <div id="workout">
                <VideoSelection 
                dispatch={dispatch} 
                setPage={setPage}
                setSelected={setSelected}/>
            <div id="muscles">
                <Images selected={selected}/>
            </div>
                <div id="searchResults">
                    <Explains 
                    selected={selected}    
                    />
                    <VideoLists
                    data={videos}
                    />
                </div>
        </div>
    );
}

export default Workout;