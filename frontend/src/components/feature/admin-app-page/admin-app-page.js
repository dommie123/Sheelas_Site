import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import { Stepper, Step, StepLabel, IconButton } from '@mui/material';

import NextIcon from '@mui/icons-material/NavigateNext';
import PreviousIcon from '@mui/icons-material/NavigateBefore';
import DoneIcon from '@mui/icons-material/Done';

import ScreeningPage from './screening-page/screening-page';

import './admin-app-page.css';

const AdminAppPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const acceptedTOS = useSelector(state => state.admin.acceptedTOS);

    const steps = ['Basic Info', 'Job Experience', 'Legal Background', 'Medical History', 'Review', 'Submit'];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handlePrevious = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const nextButtonDisabled = () => {
        return activeStep === 5 && !acceptedTOS;
    }

    useEffect(() => {
        const newCompleted = {};
        for (let i = 0; i < activeStep; i++) {
            newCompleted[i] = true;
        }
        setCompleted(newCompleted);
    }, [activeStep]);

    return (
        <div className='admin-application-page-container'>
            <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    if (completed[index]) {
                        stepProps.completed = true;
                    }

                    return (
                        <Step key={step} {...stepProps}>
                            <StepLabel {...labelProps}>{step}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <ScreeningPage activeStep={activeStep} />
            <div className='admin-application-page-button-container'>
                <IconButton
                    color='primary'
                    disabled={activeStep === 0}
                    onClick={handlePrevious}
                >
                    <PreviousIcon />
                </IconButton>
                <IconButton
                    variant='contained'
                    color='primary'
                    onClick={handleNext}
                    disabled={nextButtonDisabled()}
                >
                    {activeStep === 5 ? <DoneIcon /> : <NextIcon />}
                </IconButton>
            </div>
        </div>
    );
};

export default AdminAppPage;