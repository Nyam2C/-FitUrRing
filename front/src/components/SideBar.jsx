import react from 'react';

function SideBar(props){

    return (
        <div>
            {(props.side === 'right')?(
            <div className="sidebar rightSide">
                <h3>SideBar</h3>
            </div>
            ):(
            <div className="sidebar leftSide">
                <h3>SideBar</h3>
            </div>
            )
            }
        </div>
    );
}

export default SideBar;