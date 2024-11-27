import react, { useState } from 'react';

import './index.css';
import Ring from './Ring';
import ExerciseBlock from './ExerciseBlock';
import SideBar from './SideBar';

function displayWhat(item, mode, goal){
    if (!item.date)             
        return <></>;
    else if (!item.exercises)
        return (
            <div className="DateCell">
                <span className="center">{item.date.substr(8,2)}</span>
            </div>
        );
    else if (item.date && item.exercises){
        if (mode === 'ring')    
            return (
                <div className="DateCell">
                    <span className="center">{item.date.substr(8,2)}</span>
                    <Ring
                    data={item}
                    goal={goal} />
                </div>
            );
        else if (mode === 'list')
            return (
                <div className="DateCell">
                    <span className="center">{item.date.substr(8,2)}</span>
                    <ExerciseBlock
                    data={item} />
                </div>
            );
        else    return(
                <div>
                    <span>표시할 정보가 없습니다.</span>
                </div>
        );
    }
    else    return(
            <div>
                <span>표시할 정보가 없습니다.</span>
            </div>
    );
}

function getMax(data){
    let max = 0;
    for (let i=0; i<data.length; i++){
        if (!data[i].exercises) continue;
        let total = 0;
        for (let j=0; j<data[i].exercises.length; j++){
            let time = data[i].exercises[j].video_time;
            let min = parseInt(time.slice(0,time.indexOf(':')));
            let sec = parseInt(time.slice(time.indexOf(':')+1));
            total += (min*60+sec);
        }
        max = (max < total)? total : max;
    }
    console.log(max);
    return max;
}

function Day({data, mode, onDetail}){
    //fetch goal
    let goal = '5:00';
    if (typeof goal === 'string'){
        let total = 0;
        let min = parseInt(goal.slice(0,goal.indexOf(':')));
        let sec = parseInt(goal.slice(goal.indexOf(':')+1));
        total += (min*60+sec);
        goal = total;
    }
    if (mode === 'ring' && goal === null){
        goal = getMax(data);  
    }

    function onShow(e){
        onDetail(true);
    }

    return (
        <>
        {data.map((item) => (
            <div onClick={onShow}>
                {displayWhat(item, mode, goal)}
            </div>
        ))}
        </>
    );


    // return (
    //     <>
    //     {(mode === 'ring')?(
    //        <RingMode 
    //        data={data}/> 
    //     ) : (
    //         <ListMode 
    //         data={data}/>
    //     )} 
    //     </>
    // );


    // return (
    //     <>
    //     {data.map((item) => (
    //         <div onClick={onShow}> 
    //             {(!item.date)?(
    //                 <></>
    //             ) : (
    //                 (item.exercises)?(
    //                     <div className="DateCell">
    //                         <span className="center">{item.date.substr(8,2)}</span>
    //                         <ExerciseBlock
    //                         data={item} />
    //                     </div>
    //                     ) : (
    //                     <div className="DateCell">
    //                         <span className="center">{item.date.substr(8,2)}</span>
    //                     </div>
    //                     )
    //                 )}
    //         </div>
    //     ))}
    //     </>
    // );
}

export default Day;