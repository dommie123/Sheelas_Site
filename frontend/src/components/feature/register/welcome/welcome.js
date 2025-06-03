import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button } from '@mui/material';

import { clearRegUser } from '../../../../slices/register-slice';

import './welcome.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Clear the newly registered user's information from the app state once they have been registered successfully.
    useEffect(() => {
        return () => {
            dispatch(clearRegUser());
        }
        // eslint-disable-next-line
    }, [])

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