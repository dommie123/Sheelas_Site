import React from 'react';

import './splash.css';

export default function SplashPage() {
    return (
        <div className='splash-container'>
            <h1 className='splash-welcome-text'>Welcome!</h1>
            <div className='buttons-wrapper'>
                <a className='nav-button' id='login-nav-button' href='/login'>Log In</a>
                <a className='nav-button' id='signup-nav-button' href='/register'>Sign Up</a>
            </div>
        </div>
    )
}