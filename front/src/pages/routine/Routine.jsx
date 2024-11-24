import React, { useEffect, useState } from 'react';
import './index.css';
import Start from './Start'
import Timer from './Timer'
import Rest from './Rest'
import List from './List'
import Video from './video'



function Routine() {
    const [isActive, setIsActive] = useState(false);

    const ButtonClick = () => {
        setIsActive((prev) => !prev);
      };

    return (
        <div id="box">
            <div id="left">
                <div id="up">
                    <div className='now'>
                      
                    </div>
                    <div className='rest'>
                        <Rest/>
                    </div>
                    <div className='timer'>
                        <Timer duration={5} isActive={isActive}/>
                    </div>
                </div>
                <div id="down">
                    <div className='progress'>
                    </div>
                    <div className='video'>
                    </div>
                </div>
            </div>
            <div id="right">
                <div id='list'>
                    <List/>
                </div>
                <div id='start'>
                    <Start ButtonClick={ButtonClick} isActive = {isActive} />
                </div>
            </div>
        </div>
    );
}

export default Routine;