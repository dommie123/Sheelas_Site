import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { Card, InputAdornment, Typography } from '@mui/material';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { submitApplication } from '../../../../slices/admin-slice';
import { fromCamelCase } from '../../../../utils/strings';
import { alertUser } from '../../../../utils/alert-helpers';

import { ScreeningTextArea, ScreeningRadioGroup, ScreeningDatePicker, ScreeningTextField } from './inputs';
import AdminAppTOS from '../tos-agreement/tos-agreement';

import './screening-page.css';

const ScreeningPage = ({ activeStep }) => {
    const userInfo = useSelector(state => state.login.loggedInUser);
    const hasError = useSelector(state => state.admin.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const initialState = {
        basicInfo: {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            email: userInfo.email,
            phone: userInfo.phone
        },
        jobExperience: {
            whyAdmin: "",
            hasBeenAdmin: false,
            pastExperience: "",
            whatCanYouOffer: "",
            salaryExpectations: 0.0,
            expectedStartDate: moment().format("MM/DD/yyyy")
        },
        legalBackground: {
            hasBeenIncarcerated: false,
            pastCrimesCommitted: ""
        },
        medicalHistory: {
            hasDisabilities: false,
            medicalDisabilities: ""
        }
    }
    const salaryInputProps = {
        startAdornment: (<InputAdornment position='start'><AttachMoneyIcon /></InputAdornment>)
    }
    
    const [basicInfo, setBasicInfo] = useState(initialState.basicInfo);
    const [jobExperience, setJobExperience] = useState(initialState.jobExperience);
    const [legalBackground, setLegalBackground] = useState(initialState.legalBackground);
    const [medicalHistory, setMedicalHistory] = useState(initialState.medicalHistory);

    const determineContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Card className='basic-info-card'>
                        <Typography variant='h4' component='h2' className='basic-info-header'>Basic Information</Typography>
                        <Typography variant='h6' component='h3' className='basic-info-subheader'>We just want to ensure this information is correct.</Typography>
                        <ScreeningTextField
                            className='first-name-control'
                            label="First Name"
                            value={basicInfo.firstName}
                            handleChange={event => setBasicInfo({...basicInfo, firstName: event.target.value})}
                        />
                        <ScreeningTextField
                            className='last-name-control'
                            label="Last Name"
                            value={basicInfo.lastName}
                            handleChange={event => setBasicInfo({...basicInfo, lastName: event.target.value})}
                        />
                        <ScreeningTextField
                            className='email-control'
                            label="Email Address"
                            value={basicInfo.email}
                            handleChange={event => setBasicInfo({...basicInfo, email: event.target.value})}
                        />
                        <ScreeningTextField
                            className='phone-control'
                            label="Phone Number"
                            value={basicInfo.phone}
                            handleChange={event => setBasicInfo({...basicInfo, phone: event.target.value})}
                        />
                    </Card>
                );
            case 1:
                return (
                    <Card className='job-experience-card'>
                        <Typography variant='h4' component='h2' className='job-experience-header'>Past Job Experience</Typography>
                        <ScreeningTextArea 
                            className='why-admin-control' 
                            label="Why do you want to become an admin?" 
                            value={jobExperience.whyAdmin}
                            handleChange={event => setJobExperience({...jobExperience, whyAdmin: event.target.value})}
                        />
                        <ScreeningRadioGroup
                            className='has-been-admin-control'
                            label='Have you been a website administrator before?'
                            value={jobExperience.hasBeenAdmin ? 'Yes' : 'No'}
                            options={['Yes', 'No']}
                            handleChange={event => setJobExperience({...jobExperience, hasBeenAdmin: event.target.value === "Yes"})}
                        />
                        <ScreeningTextArea
                            className='past-experience-control'
                            label='If so, list any past experience here:'
                            value={jobExperience.pastExperience}
                            disabled={!jobExperience.hasBeenAdmin}
                            handleChange={event => setJobExperience({...jobExperience, pastExperience: event.target.value})}
                        />
                        <ScreeningTextArea
                            className='what-can-you-offer-control'
                            label='Why should Sheebay consider you for this position?'
                            value={jobExperience.whatCanYouOffer}
                            handleChange={event => setJobExperience({...jobExperience, whatCanYouOffer: event.target.value})}
                        />
                        <ScreeningTextField
                            className='salary-expectations-control'
                            label='What are your salary expectations?'
                            value={jobExperience.salaryExpectations}
                            type='number'
                            handleChange={event => setJobExperience({...jobExperience, salaryExpectations: event.target.value})}
                            InputProps={salaryInputProps}
                        />
                        <ScreeningDatePicker
                            className='expected-start-date-control'
                            label='If you are considered for the role, when will be your earliest start date?'
                            value={jobExperience.expectedStartDate}
                            handleChange={(newValue) => setJobExperience({...jobExperience, expectedStartDate: newValue.format("MM/DD/yyyy")})}
                        />
                    </Card>
                );
            case 2:
                return (
                    <Card className='legal-background-card'>
                        <Typography variant='h4' component='h2' className='legal-background-header'>Legal Background</Typography>
                        <ScreeningRadioGroup
                            className='has-been-incarcerated-control'
                            label='Have you been arrested or convicted of a crime (other than a minor traffic violation)?'
                            value={legalBackground.hasBeenIncarcerated ? 'Yes' : 'No'}
                            options={['Yes', 'No']}
                            handleChange={event => setLegalBackground({...legalBackground, hasBeenIncarcerated: event.target.value === 'Yes'})}
                        />
                        <ScreeningTextArea
                            className='past-crimes-committed-control'
                            label='If so, list your past crimes here: '
                            disabled={!legalBackground.hasBeenIncarcerated}
                            value={legalBackground.pastCrimesCommitted}
                            handleChange={event => setLegalBackground({...legalBackground, pastCrimesCommitted: event.target.value})}
                        />
                    </Card>
                )
            case 3:
                return (
                    <Card className='medical-history-card'>
                        <Typography variant='h4' component='h2' className='medical-history-header'>Medical History</Typography>
                        <ScreeningRadioGroup
                            className='has-disabilities-control'
                            label='Do you have any disabilities that may prevent you from performing your normal work duties?'
                            value={medicalHistory.hasDisabilities ? 'Yes' : 'No'}
                            options={['Yes', 'No']}
                            handleChange={event => setMedicalHistory({...medicalHistory, hasDisabilities: event.target.value === 'Yes'})}
                        />
                        <ScreeningTextArea
                            className='medical-disabilities-control'
                            label='If so, list them here: '
                            disabled={!medicalHistory.hasDisabilities}
                            value={medicalHistory.medicalDisabilities}
                            handleChange={event => setMedicalHistory({...medicalHistory, medicalDisabilities: event.target.value})}
                        />
                    </Card>
                )
            case 4: 
                return (
                    <Card className='review-app-card'>
                        <Typography variant='h4' component='h2' className='review-app-header'>Review Application</Typography>
                        <Typography variant='h6' component='h3' className='review-app-subheader'>Please take a moment to review your application. We'll still be here when you're finished.</Typography>
                        <hr />
                        <Typography variant='h6' component='h3' className='review-basic-info-header'>Basic Info</Typography>
                        {Object.entries(basicInfo).map(entry => (
                            <p className='review-entry'><b className='review-key'>{fromCamelCase(entry[0])}: </b>{parseReviewEntry(entry[1])}</p>
                        ))}
                        <hr />
                        <Typography variant='h6' component='h3' className='review-job-experience-header'>Job Experience</Typography>
                        {Object.entries(jobExperience).map(entry => (
                            <p className='review-entry'><b className='review-key'>{fromCamelCase(entry[0])}: </b>{parseReviewEntry(entry[1])}</p>
                        ))}
                        <hr />
                        <Typography variant='h6' component='h3' className='review-legal-background-header'>Legal Background</Typography>
                        {Object.entries(legalBackground).map(entry => (
                            <p className='review-entry'><b className='review-key'>{fromCamelCase(entry[0])}: </b>{parseReviewEntry(entry[1])}</p>
                        ))}
                        <hr />
                        <Typography variant='h6' component='h3' className='review-medical-history-header'>Medical History</Typography>
                        {Object.entries(medicalHistory).map(entry => (
                            <p className='review-entry'><b className='review-key'>{fromCamelCase(entry[0])}: </b>{parseReviewEntry(entry[1])}</p>
                        ))}
                    </Card>
                )
            case 5:
                return <AdminAppTOS />;
            default:
                return <></>;
        }
    };

    const parseReviewEntry = (entry) => {
        switch (typeof entry) {
            case "boolean": 
                return entry ? 'Yes' : 'No';
            case "string":
                return entry === "" ? "N/A" : entry;
            case "undefined": 
                return "N/A";
            default: 
                return entry;
        }
    }

    useEffect(() => {
        if (activeStep > 5) {
            dispatch(submitApplication({ data: { basicInfo, jobExperience, legalBackground, medicalHistory }, accessToken: userInfo.accessToken}));

            if (!hasError) {
                alertUser("Your application has been successfully submitted!");
            }
            
            navigate('/home');
        }
        // eslint-disable-next-line
    }, [activeStep])

    return (
        <div className='screening-page-container'>
            {determineContent()}
        </div>
    );
}

export default ScreeningPage;