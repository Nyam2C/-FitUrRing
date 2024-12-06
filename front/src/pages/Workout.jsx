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
    const [expose, setExpose] = useState(videos);
    const [selected, setSelected] = useState();
    const [showMore, setShowMore] = useState(false);
    const [filter, dispatch] = useReducer(FilterReducer, initial);
    
    useEffect(() => {
        fetchEntireVideos();
        }, [])
    useEffect(() => {
        if (videos.length >= 500){  //500개만 가지고있도록 관리
            //필터링 시 비디오 태그에 맞게 필터링하는 기능..
            //블록에 유튜버 이름도 보이게..
            //페이지 없앰..
            setVideos()
        }
    }, videos, filter)
    useEffect(() => {
        //필터가 바뀔때마다 필터링된 비디오 제공...
    })

    const fetchEntireVideos = async () => { 
        try{
            const last_id = (videos.length)?videos[videos.length-1]._id:null;
            const data = await getEntireVideos(last_id);
            const newVideos = [...videos, ...data.videos];
            setVideos(newVideos);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchFilteredVideos = async () => {
        try{
            const last_id = (videos.length)?videos[videos.length-1]._id:null;
            const data = await searchVideos(filter, last_id);
            const newVideos = [...videos, ...data.videos];
            console.log(data);
            setVideos(newVideos);
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleShowMore = async () => {
        console.log(filter);
        if (filter){
            console.log("filtered");
            fetchFilteredVideos()
        }
        else{
            console.log("entire");
            fetchEntireVideos();
        }
      };

        //filter에 따라서 필터링된 data를 제공
    function FilterReducer(filter, action){
        switch (action.type){
            case 'tag': {
                // if(!action.tag.length){
                //     delete filter.video_tag;
                //     console.log(filter);
                //     return filter;
                // }
                // else{
                    const newFilter = {...filter, video_tag: action.tag};
                    console.log(newFilter);
                    return newFilter;
                // } 
                //return videos.filter((t) => t.tags.indexOf(action.tag) !== -1);
            }
            case 'time': {
                const newFilter = {...filter, video_time_from: action.start, video_time_to: action.end};
                return newFilter;
                //return videos.filter((t) => t.time<action.end && t.time>action.start);
            }
            case 'level':{
                //레벨 다시 눌렀을때 없어질 수 있어야함...
                const newFilter = {...filter, video_level: action.level};
                return newFilter;
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
                    filter={filter}
                    onShowMore={handleShowMore}
                    />
                </div>
        </div>
    );
}

export default Workout;