import React, { useState } from 'react';
import moment from 'moment';

import { Navigate } from 'react-router-dom';

import { Card, InputAdornment } from '@mui/material';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { ScreeningTextArea, ScreeningRadioGroup, ScreeningDatePicker, ScreeningTextField } from './inputs';
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
            expectedStartDate: moment().format("MM/DD/yyyy")
        }
    }
    const salaryInputProps = {
        startAdornment: (<InputAdornment position='start'><AttachMoneyIcon /></InputAdornment>)
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
                            value={basicInfo.whyAdmin}
                            handleChange={event => setBasicInfo({...basicInfo, whyAdmin: event.target.value})}
                        />
                        <ScreeningRadioGroup
                            className='has-been-admin-control'
                            label='Have you been a website administrator before?'
                            value={basicInfo.hasBeenAdmin ? 'Yes' : 'No'}
                            options={['Yes', 'No']}
                            handleChange={event => setBasicInfo({...basicInfo, hasBeenAdmin: event.target.value === "Yes"})}
                        />
                        <ScreeningTextArea
                            className='past-experience-control'
                            label='If so, list any past experience here:'
                            value={basicInfo.pastExperience}
                            disabled={!basicInfo.hasBeenAdmin}
                            handleChange={event => setBasicInfo({...basicInfo, pastExperience: event.target.value})}
                        />
                        <ScreeningTextArea
                            className='what-can-you-offer-control'
                            label='Why should Sheebay consider you for this position?'
                            value={basicInfo.whatCanYouOffer}
                            handleChange={event => setBasicInfo({...basicInfo, whatCanYouOffer: event.target.value})}
                        />
                        <ScreeningTextField
                            className='salary-expectations-control'
                            label='What are your salary expectations?'
                            value={basicInfo.salaryExpectations}
                            type='number'
                            handleChange={event => setBasicInfo({...basicInfo, salaryExpectations: event.target.value})}
                            InputProps={salaryInputProps}
                        />
                        <ScreeningDatePicker
                            className='expected-start-date-control'
                            label='If you are considered for the role, when will be your earliest start date?'
                            value={basicInfo.expectedStartDate}
                            handleChange={(newValue) => setBasicInfo({...basicInfo, expectedStartDate: newValue.format("MM/DD/yyyy")})}
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