import react, {useState, useEffect} from 'react';

function Modal({children, width, height}){
    return (
        <div id="background">
            <div id="modal" style={{width: width, height: height}}>
                {children}
            </div>
        </div>
    );
}

export default Modal;