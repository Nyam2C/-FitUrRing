import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';

function SignUp() {
    return (
        <div id="sign">
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
            <div className="aside" style={{marginLeft:"auto"}}>
                <label id="title">Welcome</label>   
                <div>
                    <button type="button">sign in</button>
                </div>
            </div>
        </div>
    );
}

export default SignUp;