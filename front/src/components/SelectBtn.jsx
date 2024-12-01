import react, {useState} from 'react';

function SelectBtn({children, type, onAdd, onDelete, value, name}){
    const [isChecked, setIsChecked] = useState(false);
    function handleCheck(e){
        setIsChecked((prev) => {
            const toggled = !prev;
            if (toggled)    onAdd(e.target.value);
            else            onDelete(e.target.value);
            return toggled;
        });
    }
    switch (type){
        case 'button':
            return (<button style={{ backgroundColor: isChecked ? '#333333' : null }} value={value} name={name} onClick={handleCheck}>{children}</button>);
        case 'radio':
            return (<input type={type} value={value} name={name} />)
        default:
            return;    
        }
}

export default SelectBtn;