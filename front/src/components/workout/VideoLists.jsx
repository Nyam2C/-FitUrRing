import react, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import ExerciseBlock from '../ExerciseBlock';

function VideoLists({data}){
    return (
        <div id="videoLists">
            <ExerciseBlock
            data={data} 
            mode='clickable'
            />
        </div>
    );
}
export default VideoLists;