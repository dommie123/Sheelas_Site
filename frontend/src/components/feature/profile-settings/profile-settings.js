import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Typography, Button, Card, TextField } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

import './profile-settings.css';
import { changeUserSettings } from '../../../slices/login-slice';

export default function ProfileSettings() {
    const user = useSelector(state => state.login.loggedInUser);
    const [resetPasswordStep, setPasswordStep] = useState(0);   // 0 means the user does not want to reset their password.
    const [userSettings, setUserSettings] = useState(user);
    const dispatch = useDispatch();

    const handleSaveChanges = () => {
        dispatch(changeUserSettings({ user: { ...user, ...userSettings }, accessToken: user.accessToken }));
    }

    const handleResetChanges = () => {
        setUserSettings(user);
    }

    const handleInputChange = (event) => {
        setUserSettings({ ...userSettings, [event.target.name]: event.target.value });
    }

    return (
        <div className='profile-settings-container'>
            <Typography variant='h4' component='h4' sx={{ textAlign: "center", fontWeight: "600" }} >Profile Settings</Typography>
            <Card className='profile-information-card profile-settings-card'>
                <TextField 
                    className='profile-information-text-field profile-information-first-name' 
                    name='first_name' 
                    label="First Name" 
                    value={userSettings.first_name}
                    onChange={handleInputChange} 
                />
                <TextField 
                    className='profile-information-text-field profile-information-last-name' 
                    name='last_name' 
                    label="Last Name" 
                    value={userSettings.last_name}
                    onChange={handleInputChange} 
                />
                <TextField 
                    className='profile-information-text-field profile-information-email' 
                    name='email' 
                    label="Email"
                    value={userSettings.email}
                    onChange={handleInputChange} 
                />
                <TextField 
                    className='profile-information-text-field profile-information-phone'
                    name='phone' 
                    label="Phone" 
                    value={userSettings.phone} 
                    onChange={handleInputChange} 
                />
            </Card>
            <Card className='other-profile-settings-card profile-settings-card'>
                <Button
                    variant='outlined' 
                    color='info' 
                    lassName='change-password-btn' 
                    onClick={() => {}}
                    sx={{
                        marginRight: "auto"
                    }}
                >
                    Change Password
                </Button>
                <Button 
                    variant='outlined' 
                    color='secondary' 
                    disabled 
                    className='enable-2fa-btn' 
                    onClick={() => {}}
                    sx={{
                        marginRight: "auto"
                    }}
                >
                    Enable Two-Factor Authentication
                </Button>
            </Card>
            <div className='profile-bottom-btn-suite'>
                <Button 
                    variant='contained' 
                    color='primary' 
                    className='profile-save-settings-btn' 
                    onClick={handleSaveChanges} 
                    sx={{ width: "100%", margin: "0 2em" }}
                >
                    <SaveIcon sx={{ marginRight: "5px" }}/> Save Changes
                </Button>
                <Button 
                variant='outlined' 
                color='error' 
                className='profile-reset-settings-btn' 
                onClick={handleResetChanges} 
                sx={{ width: "100%", margin: "0 2em" }}
                >
                    <ClearIcon sx={{ marginRight: "5px" }}/> Reset Changes
                </Button>
            </div>
        </div>
    )
}