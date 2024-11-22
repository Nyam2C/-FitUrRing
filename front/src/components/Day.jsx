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

// function RingMode(data){
//     return (
//         <>
//         {data.map((item) => (
//             <div onClick={onShow}>
//                 {displayList[displayWhat(item)]}
//             </div>
//         ))}
//         </>
//     );
// }


// function ListMode(data){
//     return (
//         <>
//         {data.map((item) => (
//             <div onClick={onShow}>
//                 {displayList[displayWhat(item)]}
//             </div>
//         ))}
//         </>
//     );
// }

function sumTotal(data){
    //목표가 있으면 목표랑 비교하고 없으면 최대치랑 비교한 percentage반환
    let total = 0;
    for (let i=0; i<data.length; i++){
        if (!data[i].exercises)    continue;
        for (let j=0; j<data[i].exercises.length; j++){
            let time = data[i].exercises[j].video_time;
            let min = parseInt(time.slice(0,time.indexOf(':')));
            let sec = parseInt(time.slice(time.indexOf(':')+1));
            total += (min*60+sec);
        }
    }
    return total;
}

function Day({data, mode}){
    //total time이나 목표를 계속 가지고 있어야 한다... 
    let goal = null;
    if (mode === 'ring'){
        goal = sumTotal(data);  
    }

    function onShow(e){
        //날짜 객체 누르면 오른쪽 사이드바 열리면서 달력 width는 좁아짐
        //오른쪽 사이드바에는 그날 운동한 ExerciseBlock객체 리스트
        console.log(e.target);
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