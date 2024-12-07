import react, {useEffect, useState, useRef } from 'react';
import ExerciseBlock from '../ExerciseBlock';

import { searchVideos } from '../../api/workoutAPI';

function timeToSecond(time){
    console.log(time);
    let total = 0;
    let min = parseInt(time.slice(0,time.indexOf(':')));
    let sec = parseInt(time.slice(time.indexOf(':')+1));
    total += (min*60+sec);
    return total;
}
function VideoLists({data, filter, onShowMore, setShowModal}){
    const routines = useRef([]);

    useEffect(() => {
        fetchRoutineNames();
    }, [])

    const fetchRoutineNames = async () => { 
    try{
        const data = await getUserRoutines();
        const routine = data.map(item => item.routine_name);
        routines.current = routine;
    } catch (error) {
        console.error(error.message);
    }}

    function filteringVideos(data, filter){
        return data.filter(video => {
            const filterTag = filter.video_tag.length?filter.video_tag.some(tag => {
                return (video.video_tag.toUpperCase().indexOf(tag.toUpperCase()) !== -1 ?true:false);
            }):true;
            const filterTimeFrom = filter.video_time_from?video.video_length >= timeToSecond(filter.video_time_from):true;
            const filterTimeTo = filter.video_time_to?video.video_length <= timeToSecond(filter.video_time_to):true;
            return filterTag && filterTimeFrom && filterTimeTo;
        });    
    }
    const filteredVideos = filteringVideos(data, filter);

    return (
        <div id="videoLists">
            {filteredVideos.length?
            <>
            <ExerciseBlock
            data={filteredVideos} 
            mode='clickable'
            routines={routines.current}
            />
            <div className='more' onClick={onShowMore}>
                <button>더보기</button>
            </div>
            </> : <h1 style={{color: 'black'}}>표시할 영상이 없습니다.</h1>
        }
        </div>
    );
}
export default VideoLists;