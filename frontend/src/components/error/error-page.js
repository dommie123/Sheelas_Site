import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

import './error-page.css'

export default function ErrorPage(props) {
    const navigate = useNavigate();

    const handleReturnToSplashScreen = () => {
        navigate("/");
    }

    return (
        <div className='error-container'>
            <h1 className='error-heading'>Oops!</h1>
            <p className='error-message'>Something went wrong! Please return to the landing page and try again.</p>
            <Button 
                className='return-to-splash-button' 
                variant='contained' 
                color='primary' 
                onClick={handleReturnToSplashScreen}
            >
                Back to Landing Page
            </Button>
        </div>
    )
}