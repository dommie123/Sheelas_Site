import React from 'react';
import { Navigate } from 'react-router-dom';

import AdminAppTOS from '../tos-agreement/tos-agreement';

import './screening-page.css';

const ScreeningPage = ({ activeStep }) => {
    const determineContent = () => {
        switch (activeStep) {
            case 0:
                return <>Basic Info</>;
            case 1:
                return <>Job Experience</>;
            case 2:
                return <>Legal Background</>;
            case 3:
                return <>Medical History</>;
            case 4: 
                return <>Review App</>;
            case 5:
                return <AdminAppTOS />;
            default:
                return <Navigate to='/home' />;
        }
    };

    return (
        <div className='screening-page-container'>
            {determineContent()}
        </div>
    );
}

export default ScreeningPage;