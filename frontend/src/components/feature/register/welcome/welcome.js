import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

import './welcome.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className='welcome-container'>
            <h1 className='welcome-heading'>Welcome to SheeBay!</h1>
            <p className='welcome-paragraph'>
                Thank you for registering a new account with us. We are excited to have you on board! 
                To complete your account setup, please log in with your new credentials.
            </p>
            <Button 
                variant='contained' 
                className='log-in-button' 
                color='primary'
                onClick={() => { navigate('/login') }}
                aria-label='Log In'
            >
                Log In
            </Button>
        </div>
    );
};

export default WelcomePage;