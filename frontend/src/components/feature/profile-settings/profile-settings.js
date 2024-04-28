import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Typography, Button, Card, TextField, IconButton } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Modal } from '../../common/modal/modal';
import SwitchWithLabel from '../../common/switch/switch';

import { changeUserSettings } from '../../../slices/login-slice';
import { retrieveVerificationCode } from '../../../slices/register-slice';
import { addToMessageQueue } from '../../../slices/global-slice';

import { showError } from '../../../utils/error';

import { primaryButtonExtraStyles } from "../../../styles/global-styles";
import './profile-settings.css';

export default function ProfileSettings() {
    const user = useSelector(state => state.login.loggedInUser);
    const isMobile = useSelector(state => state.global.isMobile);
    const [resetPasswordStep, setPasswordStep] = useState(0);   // 0 means the user does not want to reset their password.
    const [userSettings, setUserSettings] = useState(user);
    const [userConfirmationCode, setUserConfirmationCode] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const dispatch = useDispatch();

    const resendVerificationCode = () => {
        dispatch(retrieveVerificationCode({ email: user.email }))
        dispatch(addToMessageQueue({ severity: "info", content: "A new code was sent to your email." }))
    }

    const handleOpenChangePasswordModal = () => {
        setPasswordStep(1);
        dispatch(retrieveVerificationCode({ email: user.email }));
    }

    const handleChangePassword = () => {
        if (userSettings.password !== confirmPass) {
            showError("The passwords don't match! Please try again.");
            return;
        }

        setPasswordStep(0);
    }

    const determineModalContent = () => {
        switch(resetPasswordStep) {
            case 1: 
                return {
                    topContent: (
                        <>
                            <IconButton className="change-password-modal-close-btn" onClick={() => { setPasswordStep(0) }}>
                                <CloseIcon />
                            </IconButton>
                            <h2 className="change-password-header">
                                We sent you a code!
                            </h2>
                        </>
                    ),
                    centerContent: (                        
                        <div className='change-password-wrapper'>
                            <TextField
                                variant='outlined'
                                label="Verification Code"
                                onChange={(e) => setUserConfirmationCode(e.target.value)}
                                className='change-password-text-field'
                                type='password'
                                value={userConfirmationCode}
                            />
                            <br />
                            <Button variant='text' onClick={resendVerificationCode}>Didn't receive a code?</Button>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='change-password-next-button' 
                            variant="contained" 
                            sx={primaryButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={() => { setPasswordStep(2) }}
                        >
                            Verify
                        </Button>
                    )
                }
            case 2: 
                return {
                    topContent: (
                        <>
                            <IconButton className="change-password-modal-back-btn" onClick={() => { setUserConfirmationCode(1) }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h2 className="change-password-header">
                                Change your password
                            </h2>
                        </>
                    ),
                    centerContent: (
                        <div className="change-password-wrapper">
                            <TextField
                                variant="outlined"
                                label="Password"
                                onChange={(e) => setUserSettings({ ...user, ...userSettings, password: e.target.value })}
                                className="change-password-text-field"
                                type="password"
                                value={userSettings.password}
                            />
                            <br />
                            <TextField
                                variant="outlined"
                                label="Confirm Password"
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="change-password-text-field"
                                type="password"
                                value={confirmPass}
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button
                            className='change-password-next-button' 
                            variant="contained" 
                            sx={primaryButtonExtraStyles} 
                            disabled={Boolean(!confirmPass)} 
                            onClick={handleChangePassword}
                        >
                            Change Password
                        </Button>
                    )
                }
            default: 
                return {
                    topContent: <></>,
                    centerContent: <></>,
                    bottomContent: <></>
                }
        }
    }

    const handleSaveChanges = () => {
        dispatch(changeUserSettings({ user: { ...user, ...userSettings }, accessToken: user.accessToken }));
        dispatch(addToMessageQueue({ severity: "success", content: "Your changes have been saved!" }))
    }

    const handleResetChanges = () => {
        setUserSettings(user);
    }

    const handleInputChange = (event) => {
        setUserSettings({ ...userSettings, [event.target.name]: event.target.value });
    }

    return (
        <div className='profile-settings-container'>
            <Typography variant='h4' component='h4' sx={{ textAlign: "center", fontWeight: "600", marginTop: isMobile ? "15px" : 0 }} >Profile Settings</Typography>
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
                    onClick={handleOpenChangePasswordModal}
                    sx={{
                        marginRight: "auto"
                    }}
                >
                    Change Password
                </Button>
                <SwitchWithLabel 
                    className='enable-twofa-switch' 
                    label="Enable Two Factor Authentication" 
                    onChange={(e) => setUserSettings({ ...userSettings, twofa_enabled: e.target.checked })} 
                    wide
                />
            </Card>
            <div className='profile-bottom-btn-suite'>
                <Button 
                    variant='contained' 
                    color='primary' 
                    className='profile-save-settings-btn' 
                    onClick={handleSaveChanges} 
                    sx={{ width: "100%", margin: "0 2em", marginBottom: isMobile ? "10px" : 0 }}
                >
                    <SaveIcon sx={{ marginRight: "5px" }}/> Save Changes
                </Button>
                <Button 
                variant='outlined' 
                color='error' 
                className='profile-reset-settings-btn' 
                onClick={handleResetChanges} 
                sx={{ width: "100%", margin: "0 2em", marginBottom: isMobile ? "5px" : 0 }}
                >
                    <ClearIcon sx={{ marginRight: "5px" }}/> Reset Changes
                </Button>
            </div>
            { resetPasswordStep > 0 ?         
                <Modal 
                    topContent={determineModalContent().topContent}
                    centerContent={determineModalContent().centerContent}
                    bottomContent={determineModalContent().bottomContent}
                /> : 
                <></> 
            }
        </div>
    )
}