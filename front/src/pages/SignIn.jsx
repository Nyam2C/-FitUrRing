import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';

function SignIn() {
    // const loginForm = document.getElementById("loginForm");
    // loginForm.addEventListener("submit", () => {
    //     const body = loginForm.get("id");
    //     console.log(body);
    // });

    return (
        <div id="sign">
            <div className="aside">
                <div>
                    <label id="title">Welcome</label>
                    <button type="button">sign up</button>
                </div>
            </div>
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
        </div>
    );
}

export default SignIn;