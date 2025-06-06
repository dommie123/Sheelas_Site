import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Checkbox, IconButton, Box, Switch, InputLabel } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { 
    incrementStep, 
    retrieveVerificationCode, 
    resetVerificationCode, 
    registerUser, 
    resetStepCounter, 
    validatePassword,
    validatePhone, 
    validateEmail, 
    decrementStep,
    setRegUser
} from '../../../slices/register-slice';
import { addToMessageQueue } from '../../../slices/global-slice';
import { showError } from '../../../utils/error';

import { Modal } from '../../common/modal/modal';
import SwitchWithLabel from '../../common/switch/switch';

import './register-modal.css';
import { objectIsEmpty } from '../../../utils/objects';

export const RegisterModal = (props) => {
    const registerStep = useSelector(state => state.register.step);
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [usernameValid, setUsernameValid] = useState(true);
    const [disablePhoneCheck, toggleDisablePhoneCheck] = useState(true);
    const emailValid = useSelector(state => state.register.emailValid);
    const phoneValid = useSelector(state => state.register.phoneValid);
    const systemConfirmationCode = useSelector(state => state.register.confirmationCode);
    const passwordValid = useSelector(state => state.register.passwordValid);
    const registeredUser = useSelector(state => state.register.regUser);
    const [userHasRegistered, setUserHasRegistered] = useState(false);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        twofa_enabled: false
    })
    const [userConfirmationCode, setUserConfirmationCode] = useState("");
    const [passConfirm, setPassConfirm] = useState("");
    const [signupDisabled, setSignupDisabled] = useState(false);

    const nextButtonExtraStyles = { 
        borderRadius: "15px", 
        fontSize: "15pt", 
        fontFamily: "'Poppins', 'Outifit', sans-serif"
    };
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const nextStep = (e) => {
        if (registerStep === 1 && (!user.first_name || !user.last_name || !user.email)) {
            showError("Please fill out all of the required fields before proceeding!");
            setFirstNameValid(Boolean(user.first_name));
            setLastNameValid(Boolean(user.last_name));
            dispatch(validateEmail(user.email));
            return;
        } else if (registerStep === 2) {
            dispatch(retrieveVerificationCode({email: user.email}))
        } else if (registerStep === 3 && systemConfirmationCode !== userConfirmationCode) {
            showError("The code you entered doesn't match the code we sent! Please try again!");
            return;
        } else if (registerStep === 3 && systemConfirmationCode === userConfirmationCode) {
            dispatch(resetVerificationCode());
        } else if (registerStep === 4 && Boolean(user.username) && passwordValid) {
            dispatch(registerUser(user));
            dispatch(resetStepCounter());
            setUserHasRegistered(true);
            // dispatch(setRegUser(user));
            // navigate("/home");
            return;
        }
        
        dispatch(incrementStep());
    }

    const previousStep = (e) => {
        switch(registerStep) {
            case 1: 
                navigate("/");
                break;
            default: 
                if (registerStep >= 2) {
                    dispatch(decrementStep());
                }
                break;
                
        }
    }

    const resendVerificationCode = () => {
        dispatch(retrieveVerificationCode({ email: user.email }))
        dispatch(addToMessageQueue({ severity: "info", content: "A new code was sent to your email." }))
    }

    useEffect(() => {

        if (user.first_name) {
            setFirstNameValid(Boolean(user.first_name));
        }

        if (user.last_name) {
            setLastNameValid(Boolean(user.last_name));
        }
        
        if (user.email) {
            dispatch(validateEmail(user.email));
        }

        if (user.phone && !disablePhoneCheck) {
            dispatch(validatePhone(user.phone));
        }

        if (user.username) {
            setUsernameValid(Boolean(user.username));
        }

        if (user.password) {
            dispatch(validatePassword(user.password));
        }
        
        setSignupDisabled(!usernameValid || !passwordValid || (passConfirm !== user.password));
        // eslint-disable-next-line
    }, [user, passConfirm]);

    useEffect(() => {
        if (userHasRegistered) {
            dispatch(setRegUser(user));
            setUserHasRegistered(false);
            return;
        }

        if (!objectIsEmpty(registeredUser)) {
            navigate('/register/welcome');
        }
        // eslint-disable-next-line
    }, [userHasRegistered, registeredUser])
    
    const determineModalContent = () => {
        switch(registerStep) {
            case 1: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-close-btn" aria-label='Close' onClick={previousStep}>
                                <CloseIcon />
                            </IconButton>
                            <h1 className='register-header' aria-label='Create account'>
                                Create your account
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className='register-wrapper'>
                            <TextField
                                variant='outlined'
                                error={!firstNameValid}
                                helperText={!firstNameValid ? "Please enter a valid first name!" : null}
                                label="First Name"
                                onChange={(e) => setUser({...user, first_name: e.target.value})}
                                className='register-text-field'
                                value={user.first_name}
                                aria-label='First Name'
                                role='textbox'
                            />
                            <br />
                            <TextField
                                variant='outlined'
                                error={!lastNameValid}
                                helperText={!lastNameValid ? "Please enter a valid last name!" : null}
                                label="Last Name"
                                onChange={(e) => setUser({...user, last_name: e.target.value})}
                                className='register-text-field'
                                value={user.last_name}
                                aria-label='Last Name'
                                role='textbox'
                            />
                            <br />
                            <TextField
                                variant='outlined'
                                error={!emailValid}
                                helperText={!emailValid ? "Please enter a valid email address!" : null}
                                label="Email Address"
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className='register-text-field'
                                value={user.email}
                                aria-label='Email Address'
                                role='textbox'
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained"                     
                            sx={nextButtonExtraStyles}   
                            disabled={!(firstNameValid && lastNameValid && emailValid)} onClick={nextStep}
                            aria-label='Next'
                        >
                            Next
                        </Button>
                    )
                }
            case 2: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-back-btn" aria-label="Back" onClick={previousStep}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h1 className='register-header' aria-label='Add a phone number? (Optional)'>
                                Add a phone number?
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className='register-wrapper'>
                            <TextField
                                variant='outlined'
                                error={!phoneValid}
                                helperText={!phoneValid ? "Please enter a valid phone number to receive SMS updates!" : null}
                                label="Phone (Optional)"
                                onChange={(e) => setUser({...user, phone: e.target.value})}
                                className='register-text-field'
                                disabled={disablePhoneCheck}
                                value={user.phone}
                                aria-label='Phone Number'
                                aria-disabled={disablePhoneCheck}
                                role='textbox'
                            />
                            <br />
                            <div className='register-two-checkbox-wrapper'>
                                <p className='register-text' id='register-text-el'>I don't want to receive SMS updates or promotional materials from SheeBay</p>
                                <Checkbox 
                                    checked={disablePhoneCheck} 
                                    aria-checked={disablePhoneCheck} 
                                    aria-labelledby='register-text-el' 
                                    role='checkbox'
                                    onChange={() => toggleDisablePhoneCheck(!disablePhoneCheck)}
                                />
                            </div>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
                            disabled={(!phoneValid || user.phone === "") && !disablePhoneCheck} 
                            onClick={nextStep}
                            aria-label='Next'
                        >
                            Next
                        </Button>
                    )
                }
            case 3: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-back-btn" aria-label="Back" onClick={previousStep}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h1 className='register-header' aria-label='We sent you a code'>
                                We sent you a code!
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className='register-wrapper'>
                            <TextField
                                variant='outlined'
                                label="Verification Code"
                                onChange={(e) => setUserConfirmationCode(e.target.value)}
                                className='register-text-field'
                                type='password'
                                value={userConfirmationCode}
                                aria-label='Verification Code'
                                role='textbox'
                            />
                            <br />
                            <Button variant='text' onClick={resendVerificationCode} aria-label="Didn't receive a code?">Didn't receive a code?</Button>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={nextStep}
                            aria-label='Verify'
                            aria-disabled={Boolean(!userConfirmationCode)}
                        >
                            Verify
                        </Button>
                    )
                }
            case 4: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-back-btn" aria-label="Back" onClick={previousStep}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h1 className='register-header' aria-label='Create a username and password'>
                                You'll need a password
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className='register-wrapper'>
                            <TextField
                                variant='outlined'
                                size='small'
                                error={!lastNameValid}
                                helperText={!lastNameValid ? "Please enter a valid username!" : null}
                                label="Username"
                                onChange={(e) => setUser({...user, username: e.target.value})}
                                className='register-text-field'
                                value={user.username}
                                aria-label='Username'
                                role='textbox'
                            />
                            <br />
                            <TextField
                                variant='outlined'
                                size='small'
                                error={!passwordValid}
                                helperText={!passwordValid ? "Your password MUST be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol!" : null}
                                label="Password"
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className='register-text-field'
                                type='password'
                                value={user.password}
                                aria-label='Password'
                                role='textbox'
                            />
                            <br />
                            <TextField
                                variant='outlined'
                                size='small'
                                error={signupDisabled}
                                helperText={passConfirm !== user.password ? "The passwords don't match! Please try again!" : null}
                                label="Confirm Password"
                                onChange={(e) => setPassConfirm(e.target.value)}
                                className='register-text-field'
                                type='password'
                                value={passConfirm}
                                aria-label='Confirm Password'
                                role='textbox'
                            />
                            <br />
                            <SwitchWithLabel 
                                className='enable-twofa-switch' 
                                label="Enable Two Factor Authentication" 
                                onChange={(e) => setUser({ ...user, twofa_enabled: e.target.checked })} 
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
                            disabled={signupDisabled} 
                            onClick={nextStep}
                            aria-label='Sign Up'
                            aria-disabled={signupDisabled} 
                        >
                            Sign Up
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

    return (
        <Modal 
            topContent={determineModalContent().topContent}
            centerContent={determineModalContent().centerContent}
            bottomContent={determineModalContent().bottomContent}
        />
    )
}