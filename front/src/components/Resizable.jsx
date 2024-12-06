import react, { useState } from 'react';

function Resizable({defaultSize, children}){
    const [leftSize, setLeftSize] = useState(defaultSize);
    const [rightSize, setRightSize] = useState(defaultSize);
    const [isResizing, setIsResizing] = useState(false);

    function startResize(e){
        console.log(e.target.getBoundingClientRect());
        
    }   

    function handleResize(e){
        setIsResizing(true);
    }

    function finishResize(e){
        // const left = e.target.getBoundingClientRect().left;
        // const right = e.target.getBoundingClientRect().right;
        // const newWidth = right - left;
        // //마우스업이 발생한 지점의 clientX가 그 컴포넌트의 너비가 됨...
        // //console.log(e.clientX);
        // e.target.style.width=newWidth;
        // console.log(e.clientX);
        e.target.getBoundingClientRect().left = e.clientX;

    }

    //onMouseUp={handle}
    return(
        <div onMouseDown={startResize} onMouseMove={handleResize} onMouseUp={finishResize}
        style={{backgroundColor:"#999999"}}>
            <div style={{backgroundColor:"#555555"}}></div>
            <h2>Resizable</h2>
            {children}
        </div>
    );
}
export default Resizable;