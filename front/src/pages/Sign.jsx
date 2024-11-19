import React, { useEffect, useState } from 'react';
import './index.css';

function SignInForm(){
    return (
        <form id="signInForm">
            <label id="title">Sign In</label>
            <input 
            id="id"
            type="text" 
            name="id" 
            placeholder='ID'
            ></input>
            <input 
            id="pw"
            type="password" 
            name="pw" 
            placeholder='PW'
            ></input>
            <button type="submit">sign in</button>
        </form>
    );
}

function SignUpForm(){
    return (
        <form id="signUpForm">
            <label id="title">Sign Up</label>
            <input required id="name" type="text" name="name" placeholder='성함'></input>
            <input required id="id" type="text" name="id" placeholder='ID'></input>
            <input required id="pw" type="password" name="pw" placeholder='PW'></input>
            <input required id="pwConfirm" type="password" name="pwConfirm" placeholder='PW를 한번 더 입력해주세요'></input>
            <input required id="email" type="email" name="email" placeholder='이메일'></input>

            <div style={{display: "flex", width: "30em", justifyContent: "center"}}>
                <input id="age" type="number" name="age" placeholder='나이'></input>
                <input id="height" type="number" name="height" placeholder='키'></input>
                <input id="weight" type="number" name="weight" placeholder='몸무게'></input>
            </div>

            <button type="submit">sign up</button>
        </form>

    );
}

function AsideContent({ isActive, onShow, title, label }){
    return (
        <>
            {isActive?(
                null
            ) : (
                <aside>
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
                <SignInForm />
            </Panel>

            <Panel
                isActive={activeIndex === 1}
                onShow={() => setActiveIndex(1)}
            >
                <SignUpForm />
            </Panel>
            <AsideContent
                isActive={activeIndex === 1}
                onShow={() => setActiveIndex(1)}
                title="Sign Up"
                label="Sign Up"
            />
        </div>
    );
}

export default Sign;