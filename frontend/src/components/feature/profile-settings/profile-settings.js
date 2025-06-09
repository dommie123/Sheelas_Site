// React Imports
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Material Imports
import { Typography, Button, Card, TextField, IconButton } from '@mui/material';

// Material Icons
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Custom Components
import { Modal } from '../../common/modal/modal';
import SwitchWithLabel from '../../common/switch/switch';

// Slice Imports
import { changeUserSettings, clearUnverifiedUser, fetchUser } from '../../../slices/login-slice';
import { retrieveVerificationCode } from '../../../slices/register-slice';
import { addToMessageQueue } from '../../../slices/global-slice';

// Custom Imports
import { showError } from '../../../utils/error';
import { objectIsEmpty } from '../../../utils/objects';

// Style Imports
import { primaryButtonExtraStyles } from "../../../styles/global-styles";
import './profile-settings.css';

export default function ProfileSettings() {
    const user = useSelector(state => state.login.loggedInUser);
    const isMobile = useSelector(state => state.global.isMobile);
    const unverifiedUser = useSelector(state => state.login.unverifiedUser);    // Used to check if fetchUser is successful.
    const errorMessage = useSelector(state => state.login.error);
    const [resetPasswordStep, setPasswordStep] = useState(0);   // 0 means the user does not want to reset their password.
    const [demoteSelfStep, setDemoteSelfStep] = useState(0);
    const [isCancellingMembership, setCancellingMembership] = useState(false);
    const [userSettings, setUserSettings] = useState({
        id: -1,
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
    });
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

    const handleOpenDemoteSelfModal = () => {
        setDemoteSelfStep(1);
        dispatch(retrieveVerificationCode({ email: user.email }));
    }

    const handleChangePassword = () => {
        if (userSettings.password === "") {
            showError("Please enter a password.");
            return;
        }
        if (userSettings.password !== confirmPass) {
            showError("The passwords don't match! Please try again.");
            return;
        }

        setPasswordStep(0);
    }

    const handleOpenCancelMembershipModal = () => {
        setCancellingMembership(true);
    }

    const handleCancelMembership = () => {
        dispatch(changeUserSettings({ user: {...user, role: 2 }, accessToken: user.accessToken }));
        setCancellingMembership(false);
    }

    const handleCloseCancelMembershipModal = () => {
        setCancellingMembership(false);
    }

    const handleDemoteSelf = () => {
        // TODO demote admin to buyer or seller depending on if they have a seller plan
        if (userSettings.password === "") {
            showError("Please enter a password.");
            return;
        }
        if (userSettings.password !== confirmPass) {
            showError("The passwords don't match! Please try again.");
            return;
        }

        dispatch(fetchUser({ username: user.username, password: userSettings.password }));
    } 

    const determineDemoteSelfModalContent = () => {
        switch(demoteSelfStep) {
            case 1: 
                return {
                    topContent: (
                        <>
                            <IconButton className="demote-self-modal-close-btn" onClick={() => { setDemoteSelfStep(0) }}>
                                <CloseIcon />
                            </IconButton>
                            <h2 className="demote-self-header">
                                We sent you a code!
                            </h2>
                        </>
                    ),
                    centerContent: (                        
                        <div className='demote-self-wrapper'>
                            <TextField
                                variant='outlined'
                                label="Verification Code"
                                onChange={(e) => setUserConfirmationCode(e.target.value)}
                                className='demote-self-text-field'
                                type='password'
                                value={userConfirmationCode}
                            />
                            <br />
                            <Button variant='text' onClick={resendVerificationCode}>Didn't receive a code?</Button>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='demote-self-next-button' 
                            variant="contained" 
                            sx={primaryButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={() => { setDemoteSelfStep(2) }}
                        >
                            Verify
                        </Button>
                    )
                }
            case 2: 
                return {
                    topContent: (
                        <>
                            <IconButton className="demote-self-back-btn" aria-label="Back" onClick={() => setDemoteSelfStep(1)}>
                                <ArrowBackIcon />
                            </IconButton>
                            <div className='demote-self-head-wrapper'>
                                <h1 className="demote-self-header" aria-label="Confirm removal of admin role">
                                    Password Confirmation
                                </h1>
                                <b className="demote-self-subheader">To confirm the removal of your admin status, please enter your password.</b>
                            </div>
                        </>
                    ),
                    centerContent: (
                        <div className="demote-self-wrapper">
                            <TextField
                                variant="outlined"
                                label="Password"
                                onChange={(e) => setUserSettings({...user, ...userSettings, password: e.target.value})}
                                className="demote-self-text-field"
                                type="password"
                                value={user.password}
                                aria-label='Password'
                                role='textbox'
                            />
                            <br />
                            <TextField
                                variant="outlined"
                                label="Confirm Password"
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="demote-self-text-field"
                                type="password"
                                value={confirmPass}
                                aria-label='Confirm Password'
                                role='textbox'
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button
                            className='login-next-button' 
                            variant="contained" 
                            sx={primaryButtonExtraStyles}
                            color="error" 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={handleDemoteSelf}
                            aria-label='Retire Admin Role'
                            aria-disabled={Boolean(!userConfirmationCode)}
                        >
                            Retire Admin Role
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

    const determineChangePasswordModalContent = () => {
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

    const determineCancelMembershipModalContent = () => {
        return {
            topContent: <>
                <IconButton className='confirm-cancel-membership-modal-close-btn' onClick={handleCloseCancelMembershipModal}>
                    <CloseIcon />
                </IconButton>
                <h2 className='confirm-cancel-membership-header'>Please confirm</h2>
            </>,
            centerContent: <p className='confirm-cancel-membership-paragraph'>Are you sure you want to cancel your seller membership plan?</p>,
            bottomContent: <div className='confirm-cancel-membership-button-suite'>
                <Button 
                    variant='contained' 
                    color='primary' 
                    className='confirm-cancel-membership-yes-btn' 
                    onClick={handleCancelMembership}
                >
                    Yes
                </Button>
                <Button 
                    variant='outlined' 
                    color='error' 
                    className='confirm-cancel-membership-no-btn' 
                    onClick={handleCloseCancelMembershipModal}
                >
                    No
                </Button>
            </div>
        }
    }

    const renderModal = useMemo(() => {
        let modalContent = null;

        if (resetPasswordStep > 0) {
            modalContent = determineChangePasswordModalContent();
        } else if (demoteSelfStep > 0) {
            modalContent = determineDemoteSelfModalContent();
        } else if (isCancellingMembership) {
            modalContent = determineCancelMembershipModalContent();
        } 

        return modalContent ? <Modal {...modalContent} /> : <></>

        // eslint-disable-next-line
    }, [resetPasswordStep, demoteSelfStep, isCancellingMembership, userConfirmationCode, userSettings]);

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

    useEffect(() => {
        // Do nothing if the user is not trying to remove their admin role.
        if (demoteSelfStep !== 2) {
            return;
        }

        if (demoteSelfStep === 2 && (!confirmPass || confirmPass === "")) {
            return;
        }   

        // If user is not verified and they are in the process of demoting themselves, do nothing.
        if (objectIsEmpty(unverifiedUser) && demoteSelfStep === 2) {
            showError(errorMessage);
            return;
        }

        // Otherwise, reset step counter and demote the user.
        setDemoteSelfStep(0);

        let newRole = 3; // Seller role
        if (user.sellerPlan === 0) {
            newRole = 2 // Buyer role
        }

        console.log({...user, role: newRole})

        dispatch(changeUserSettings({user: {...user, role: newRole}, accessToken: user.accessToken }));
        // eslint-disable-next-line
    }, [demoteSelfStep, unverifiedUser]);

    useEffect(() => {
        if (userSettings.id === -1 && !objectIsEmpty(user)) {
            setUserSettings(user);
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        return () => {
            dispatch(clearUnverifiedUser());
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        console.log({userConfirmationCode});
    }, [userConfirmationCode])

    return (
        <div className='profile-settings-container'>
            <Typography 
                variant='h4' 
                component='h2' 
                sx={{ 
                    textAlign: "center", 
                    fontWeight: "600", 
                    marginTop: isMobile ? "15px" : 0 
                }} 
                aria-label='Profile Settings'
                role='header'
            >
                Profile Settings
            </Typography>
            <Card className='profile-information-card profile-settings-card'>
                <TextField 
                    className='profile-information-text-field profile-information-first-name' 
                    name='first_name' 
                    label="First Name" 
                    value={userSettings.first_name}
                    onChange={handleInputChange} 
                    aria-label='Change first name'
                />
                <TextField 
                    className='profile-information-text-field profile-information-last-name' 
                    name='last_name' 
                    label="Last Name" 
                    value={userSettings.last_name}
                    onChange={handleInputChange} 
                    aria-label='Change last name'
                />
                <TextField 
                    className='profile-information-text-field profile-information-email' 
                    name='email' 
                    label="Email"
                    value={userSettings.email}
                    onChange={handleInputChange} 
                    aria-label='Change email'
                />
                <TextField 
                    className='profile-information-text-field profile-information-phone'
                    name='phone' 
                    label="Phone" 
                    value={userSettings.phone} 
                    onChange={handleInputChange} 
                    aria-label='Change phone number'
                />
            </Card>
            <Card className='other-profile-settings-card profile-settings-card'>
                <Button
                    variant='outlined' 
                    color='info' 
                    className='change-password-btn' 
                    onClick={handleOpenChangePasswordModal}
                    sx={{
                        marginRight: "auto",
                        color: "#245cd4",
                        borderColor: "#245cd4"
                    }}
                    aria-label='Change Password'
                >
                    Change Password
                </Button>
                <SwitchWithLabel 
                    className='enable-twofa-switch' 
                    label="Enable Two Factor Authentication" 
                    onChange={(e) => setUserSettings({ ...userSettings, twofa_enabled: e.target.checked })} 
                    wide
                />
                {user.role === 1 && <Button
                    variant='outlined'
                    color='error'
                    className='demote-self-btn'
                    onClick={handleOpenDemoteSelfModal}
                    sx={{
                        marginRight: "auto",
                    }}
                    aria-label='Retire Admin Role'
                >
                    Retire Admin Role
                </Button>}
                {user.role === 3 && <Button
                    variant='outlined'
                    color='error'
                    className='cancel-seller-plan-btn'
                    onClick={handleOpenCancelMembershipModal}
                    sx={{
                        marginRight: "auto",
                    }}
                    aria-label='Cancel Seller Membership'
                >
                    Cancel Seller Membership
                </Button>}
            </Card>
            <div className='profile-bottom-btn-suite'>
                <Button 
                    variant='contained' 
                    color='primary' 
                    className='profile-save-settings-btn' 
                    onClick={handleSaveChanges} 
                    sx={{ width: "100%", margin: "0 2em", marginBottom: isMobile ? "10px" : 0 }}
                    aria-label='Save Changes'
                >
                    <SaveIcon sx={{ marginRight: "5px" }}/> Save Changes
                </Button>
                <Button 
                    variant='outlined' 
                    color='error' 
                    className='profile-reset-settings-btn' 
                    onClick={handleResetChanges} 
                    sx={{ width: "100%", margin: "0 2em", marginBottom: isMobile ? "5px" : 0 }}
                    aria-label='Reset Changes'
                >
                    <ClearIcon sx={{ marginRight: "5px" }}/> Reset Changes
                </Button>
            </div>
            {renderModal}
        </div>
    )
}