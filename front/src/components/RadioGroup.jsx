import {react} from 'react';

import './index.css';

function RadioGroup({label, children, mode}){

    return (
        <div className='col'>
            <h3>{label}</h3>
            {children}
        </div>
    );
}
export default RadioGroup;