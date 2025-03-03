import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { Card } from '@mui/material';

import { ScreeningTextArea, ScreeningRadioGroup } from './inputs';

import AdminAppTOS from '../tos-agreement/tos-agreement';

import './screening-page.css';

const ScreeningPage = ({ activeStep }) => {
    const initialState = {
        basicInfo: {
            whyAdmin: "",
            hasBeenAdmin: false,
            pastExperience: "",
            whatCanYouOffer: "",
            salaryExpectations: 0.0,
            expectedStartDate: ""
        }
    }

    const [basicInfo, setBasicInfo] = useState(initialState.basicInfo);

    const determineContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Card className='basic-info-card'>
                        <ScreeningTextArea 
                            className='why-admin-control' 
                            label="Why do you want to become an admin?" 
                            handleChange={event => setBasicInfo({...basicInfo, whyAdmin: event.target.value})}
                        />
                        <ScreeningRadioGroup
                            className='has-been-admin-control'
                            label='Have you been a website administrator before?'
                            options={['Yes', 'No']}
                            handleChange={event => setBasicInfo({...basicInfo, hasBeenAdmin: event.target.value})}
                        />
                        <ScreeningTextArea
                            className='past-experience-control'
                            label='If so, list any past experience here:'
                            handleChange={event => setBasicInfo({...basicInfo, pastExperience: event.target.value})}
                        />
                        <ScreeningTextArea
                            className='what-can-you-offer-control'
                            label='Why should Sheebay consider you for this position?'
                            handleChange={event => setBasicInfo({...basicInfo, whatCanYouOffer: event.target.value})}
                        />
                        <ScreeningTextArea
                            className='salary-expectations-control'
                            label='What are your salary expectations?'
                            handleChange={event => setBasicInfo({...basicInfo, salaryExpectations: event.target.value})}
                        />
                        <ScreeningTextArea
                            className='expected-start-date-control'
                            label='If you are considered for the role, when will be your earliest start date?'
                            handleChange={event => setBasicInfo({...basicInfo, expectedStartDate: event.target.value})}
                        />
                    </Card>
                );
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