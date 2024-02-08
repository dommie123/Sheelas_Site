import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Checkbox, IconButton } from "@mui/material";

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

import './register-modal.css';
import { logInUser } from '../../../slices/login-slice';

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
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
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
            dispatch(setRegUser(user));
            navigate("/home");
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

    }, [user, passConfirm])
    
    const determineModalContent = () => {
        switch(registerStep) {
            case 1: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-close-btn" onClick={previousStep}>
                                <CloseIcon />
                            </IconButton>
                            <h2 className='register-header'>
                                Create your account
                            </h2>
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
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained"                     
                            sx={nextButtonExtraStyles}   
                            disabled={!(firstNameValid && lastNameValid && emailValid)} onClick={nextStep}
                        >
                            Next
                        </Button>
                    )
                }
            case 2: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-back-btn" onClick={previousStep}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h2 className='register-header'>
                                Add a phone number?
                            </h2>
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
                            />
                            <br />
                            <div className='register-two-checkbox-wrapper'>
                                <p className='register-text'>I don't want to receive SMS updates or promotional materials from Sheela's Shopping Site</p>
                                <Checkbox checked={disablePhoneCheck} onChange={() => toggleDisablePhoneCheck(!disablePhoneCheck)}/>
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
                        >
                            Next
                        </Button>
                    )
                }
            case 3: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-back-btn" onClick={previousStep}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h2 className='register-header'>
                                We sent you a code!
                            </h2>
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
                            />
                            <br />
                            <Button variant='text' onClick={resendVerificationCode}>Didn't receive a code?</Button>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={nextStep}
                        >
                            Verify
                        </Button>
                    )
                }
            case 4: 
                return {
                    topContent: (
                        <>
                            <IconButton className="register-modal-back-btn" onClick={previousStep}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h2 className='register-header'>
                                You'll need a password
                            </h2>
                        </>
                    ),
                    centerContent: (
                        <div className='register-wrapper'>
                            <TextField
                                variant='outlined'
                                error={!lastNameValid}
                                helperText={!lastNameValid ? "Please enter a valid username!" : null}
                                label="Username"
                                onChange={(e) => setUser({...user, username: e.target.value})}
                                className='register-text-field'
                                value={user.username}
                            />
                            <br />
                            <TextField
                                variant='outlined'
                                error={!passwordValid}
                                helperText={!passwordValid ? "Please enter a valid password!" : null}
                                label="Password"
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className='register-text-field'
                                type='password'
                                value={user.password}
                            />
                            <br />
                            <TextField
                                variant='outlined'
                                error={signupDisabled}
                                helperText={passConfirm !== user.password ? "The passwords don't match! Please try again!" : null}
                                label="Confirm Password"
                                onChange={(e) => setPassConfirm(e.target.value)}
                                className='register-text-field'
                                type='password'
                                value={passConfirm}
                            />
                            <br />
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='register-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
                            disabled={signupDisabled} onClick={nextStep}
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