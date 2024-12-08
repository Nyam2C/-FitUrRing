import React, { useState, useEffect, useReducer } from 'react';

import VideoLists from '../components/workout/VideoLists';
import VideoSelection from '../components/workout/VideoSelection';
import Images from '../components/workout/Images';
import explain from '../assets/explains.json';

import { getEntireVideos, searchVideos} from '../api/workoutAPI';


function Explains({data, selected}){
    return (
        <div id="explains">
            <h1>{explain.find(item => item.id === selected)?.name}</h1>
            <p className="content">{explain.find(item => item.id === selected)?.explains}</p>
            <p className="source">{explain.find(item => item.id === selected)?.source}</p>  
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
    const [showMore, setShowMore] = useState(false);
    const [filter, dispatch] = useReducer(FilterReducer, initial);
    
    useEffect(() => {
        fetchEntireVideos();
        }, [])
    useEffect(() => {
        if (videos.length > 500){  //500개만 가지고있도록 관리
            setVideos(videos.slice(-500));
        }
    }, videos)

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

    function FilterReducer(filter, action){
        switch (action.type){
            case 'tag': {
                    const newFilter = {...filter, video_tag: action.tag};
                    console.log(newFilter);
                    return newFilter;   
            }
            case 'time': {
                const newFilter = {...filter, video_time_from: action.start, video_time_to: action.end};
                return newFilter;
            }
            case 'level':{
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