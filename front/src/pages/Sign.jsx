import React, { useEffect, useState } from 'react';
import './index.css';
import SignIn from '../components/user/SignIn';
import SignUp from '../components/user/SignUp';
import { userLogin, userSignUp } from '../api';

function AsideContent({ isActive, onShow, title, label }){
    let move = '';
    if (label === 'Sign In') move = 'rightmove';
    else                     move = 'leftmove';

    return (
        <>
            {isActive?(
                null
            ) : (
                <aside id='aside' className={move}>
                    <h1 id="title">{title}</h1>
                    <button onClick={onShow}>
                        <span>{label}</span>
                    </button>
                </aside>
            )}
        </>
    )
}

function Panel({ isActive, children }){
    return (
        <>
            {isActive?(
                <section className="panel">
                    <div>{children}</div>
                </section>
            ) : (
                null
            )}
        </>
    )
}

function Sign() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div id="sign">
            <AsideContent 
                isActive={activeIndex === 0}
                onShow={() => setActiveIndex(0)}
                title="Welcome"
                label="Sign In"
            />
            <Panel 
                isActive={activeIndex === 0}
                onShow={() => setActiveIndex(0)}
            >
                <SignIn />
            </Panel>

            <Panel
                isActive={activeIndex === 1}
                onShow={() => setActiveIndex(1)}
            >
                <SignUp />
            </Panel>
            <AsideContent
                isActive={activeIndex === 1}
                onShow={() => setActiveIndex(1)}
                title="Workout now"
                label="Sign Up"
            />
        </div>
    );
}

export default Sign;