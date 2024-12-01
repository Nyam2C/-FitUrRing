import react from 'react';

import {ReactComponent as Soleus} from '../assets/가자미근.svg';
import {ReactComponent as Thighs} from '../assets/대퇴사두근.svg';
import {ReactComponent as Chest} from '../assets/대흉근.svg';
import {ReactComponent as Glutes} from '../assets/둔근.svg';
import {ReactComponent as Abs} from '../assets/복직근.svg';
import {ReactComponent as Gastrocnemius } from '../assets/비복근.svg';
import {ReactComponent as Deltoid} from '../assets/삼각근.svg';
import {ReactComponent as Triceps} from '../assets/삼두근.svg';
import {ReactComponent as Back} from '../assets/등근육.svg';
import {ReactComponent as Forearm} from '../assets/전완근.svg';
import {ReactComponent as Biceps} from '../assets/이두근.svg';
import {ReactComponent as Hamstring} from '../assets/햄스트링.svg';
import {ReactComponent as FullBody} from '../assets/전신.svg';


function Images({selected}){

    switch(selected){
        case 'chest':
            return  <Chest width='30vw' height='80vh'/>
        case 'back':
            return <Back width='30vw' height='80vh'/>
        case 'shoulders':
            return <Deltoid width='30vw' height='80vh'/>
        case 'abs':
            return <Abs width='30vw' height='80vh'/>
        case 'thighs':
            return <Thighs width='30vw' height='80vh'/>
        case 'glutes':
            return <Glutes width='30vw' height='80vh'/>
        default:
            return <FullBody width='30vw' height='80vh'/>;
    }
}
export default Images;