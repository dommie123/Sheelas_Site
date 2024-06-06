// React Imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// MUI Imports
import { TextField, Button, IconButton } from "@mui/material";

// MUI Icons
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Slice Imports
import { incrementStep, decrementStep, logInUser, verifyUserExists, resetStepCounter, changePassword, fetchUser } from "../../../slices/login-slice";
import { retrieveVerificationCode } from "../../../slices/register-slice";
import { addToMessageQueue } from "../../../slices/global-slice";

// Custom Utils
import { showError } from "../../../utils/error";
import { objectIsEmpty } from "../../../utils/objects";

// Custom Components
import { Modal } from "../../common/modal/modal";

// Style Imports
import { primaryButtonExtraStyles } from "../../../styles/global-styles";
import "./login-modal.css";

export const LoginModal = () => {
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const unverifiedUser = useSelector(state => state.login.unverifiedUser);
    const forgotPasswordStep = useSelector(state => state.login.forgotPasswordStep);
    const userExists = useSelector(state => state.login.userExists);
    const confirmationCode = useSelector(state => state.register.confirmationCode);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [userConfirmationCode, setUserConfirmationCode] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [twofaActive, setTwofaActive] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signInUser = () => {
        dispatch(fetchUser(user));
    }

    const resendVerificationCode = () => {
        dispatch(retrieveVerificationCode({ email: objectIsEmpty(loggedInUser) ? unverifiedUser.email : loggedInUser.email }));
        dispatch(addToMessageQueue({ severity: "info", content: "A new code was sent to your email." }))
    }

    const nextStep = useCallback(() => {
        switch(forgotPasswordStep) {
            case 1: 
                dispatch(verifyUserExists({username: user.username}));
                break;
            case 2: 
                if (userConfirmationCode !== confirmationCode) {
                    showError("That code doesn't match the one we sent you! Please try again.");
                    return;
                }

                dispatch(incrementStep())
                break;
            case 3: 
                if (user.password !== confirmPass) {
                    showError("The passwords don't match! Please try again.");
                    return;
                }
                
                dispatch(changePassword(user));
                dispatch(resetStepCounter());
                setForgotPassword(false);
                signInUser();
                break;
            default:
                break;
        }
        // eslint-disable-next-line
    }, [forgotPasswordStep, loggedInUser, user, confirmPass, userExists]);

    const logInUser2fa = () => {
        if ((unverifiedUser.twofa_enabled && userConfirmationCode === confirmationCode && confirmationCode !== "") || !unverifiedUser.twofa_enabled) { 
            dispatch(logInUser(user));
            setTwofaActive(false);
        } else {
            setTwofaActive(true);
        }
    }

    useEffect(() => {
        if ((!userExists && user.username) || !user.username) {
            return;
        }

        dispatch(retrieveVerificationCode({email: loggedInUser.email}));
        dispatch(incrementStep());
        // eslint-disable-next-line
    }, [userExists]);

    useEffect(() => {
        if (objectIsEmpty(unverifiedUser)) {
            return;
        }

        if (!objectIsEmpty(loggedInUser)) {
            return;
        }

        logInUser2fa();
    }, [unverifiedUser, loggedInUser])

    useEffect(() => {
        if (twofaActive) {
            dispatch(retrieveVerificationCode({email: unverifiedUser.email}));
        }
    }, [twofaActive])

    const determineModalContent = () => {
        if (!forgotPassword && !twofaActive) {
            return {
                topContent: (
                    <>
                        <IconButton className="login-modal-close-btn" aria-label="Close" onClick={() => {navigate("/")}}>
                            <CloseIcon />
                        </IconButton>
                        <h1 className="login-header">
                            Sign In Here!
                        </h1>
                    </>
                ),
                centerContent: (
                    <div className="login-wrapper">
                        <TextField className="login-text-field" variant="outlined" label="Username" onChange={(e) => setUser({...user, username: e.target.value})} value={user.username} />
                        <br />
                        <TextField className="login-text-field" variant="outlined" label="Password" onChange={(e) => setUser({...user, password: e.target.value})} type="password" value={user.password} />
                        <br />
                        <Button variant="text" onClick={() => {
                            setUser({
                                username: '',
                                password: ''
                            });
                            setForgotPassword(true);
                        }}>
                            Forgot Password?
                        </Button>
                    </div>
                ),
                bottomContent: (
                    <Button 
                        className="login-next-button" 
                        variant="contained" 
                        sx={primaryButtonExtraStyles}
                        onClick={signInUser}   
                    >Sign In</Button>
                )
            }
        } else if (unverifiedUser.twofa_enabled) {
            return {
                topContent: (
                    <>
                        <IconButton className="login-modal-back-btn" onClick={() => { setTwofaActive(false); }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <h1 className='login-header'>
                            We sent you a code!
                        </h1>
                    </>
                ),
                centerContent: (
                    <div className='login-wrapper'>
                        <TextField
                            variant='outlined'
                            label="Verification Code"
                            onChange={(e) => setUserConfirmationCode(e.target.value)}
                            className='login-text-field'
                            type='password'
                            value={userConfirmationCode}
                        />
                        <br />
                        <Button variant='text' onClick={resendVerificationCode}>Didn't receive a code?</Button>
                    </div>
                ),
                bottomContent: (
                    <Button 
                        className='login-next-button' 
                        variant="contained" 
                        sx={primaryButtonExtraStyles} 
                        disabled={Boolean(!userConfirmationCode)} 
                        onClick={() => {
                            if (userConfirmationCode === confirmationCode) {
                                logInUser2fa();
                            } else {
                                showError("That code doesn't match the one we sent you! Please try again or request a new code.");
                            }
                        }}
                    >
                        Sign In
                    </Button>
                )
            }
        }

        switch(forgotPasswordStep) {
            case 1: 
                return { 
                    topContent: (
                        <>
                            <IconButton className="login-modal-back-btn" onClick={() => { setForgotPassword(false) }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h1 className="login-header">
                                Recover your account
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className="login-wrapper">
                            <TextField className="login-text-field" variant="outlined" label="Username" onChange={(e) => setUser({...user, username: e.target.value})} value={user.username} />
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className="login-next-button" 
                            variant="contained" 
                            sx={primaryButtonExtraStyles}
                            onClick={nextStep}   
                        >
                            Send me a code
                        </Button>
                    )   
                }
            case 2: 
                return {
                    topContent: (
                        <>
                            <IconButton className="login-modal-back-btn" onClick={() => {dispatch(decrementStep())}}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h1 className='login-header'>
                                We sent you a code!
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className='login-wrapper'>
                            <TextField
                                variant='outlined'
                                label="Verification Code"
                                onChange={(e) => setUserConfirmationCode(e.target.value)}
                                className='login-text-field'
                                type='password'
                                value={userConfirmationCode}
                            />
                            <br />
                            <Button variant='text' onClick={resendVerificationCode}>Didn't receive a code?</Button>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='login-next-button' 
                            variant="contained" 
                            sx={primaryButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={nextStep}
                        >
                            Verify
                        </Button>
                    )
                }
            case 3: 
                return {
                    topContent: (
                        <>
                            <IconButton className="login-modal-back-btn" onClick={() => {dispatch(decrementStep())}}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h1 className="login-header">
                                Change your password
                            </h1>
                        </>
                    ),
                    centerContent: (
                        <div className="login-wrapper">
                            <TextField
                                variant="outlined"
                                label="Password"
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className="login-text-field"
                                type="password"
                                value={user.password}
                            />
                            <br />
                            <TextField
                                variant="outlined"
                                label="Confirm Password"
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="login-text-field"
                                type="password"
                                value={confirmPass}
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button
                            className='login-next-button' 
                            variant="contained" 
                            sx={primaryButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={nextStep}
                        >
                            Sign In
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

    useEffect(() => {
        // If the user is already logged in, send them home.
        if (loggedInUser && loggedInUser.accessToken) {
            dispatch(addToMessageQueue({ severity: "success", content: `Welcome, ${loggedInUser.first_name}!` }))
            navigate("/home");  
        }
        // eslint-disable-next-line
    }, [loggedInUser])

    useEffect(() => {
        if (forgotPassword && forgotPasswordStep === 1) {
            setUser({
                username: '',
                password: ''
            })
        }
        // eslint-disable-next-line
    }, [forgotPassword])

    return (
        <Modal 
            topContent={determineModalContent().topContent}
            centerContent={determineModalContent().centerContent}
            bottomContent={determineModalContent().bottomContent}
        />
    )
    
}