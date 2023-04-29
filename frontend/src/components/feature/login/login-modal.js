import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { TextField, Button, } from "@mui/material";

import { incrementStep, logInUser, verifyUserExists, resetStepCounter, changePassword } from "../../../slices/login-slice";
import { retrieveVerificationCode } from "../../../slices/register-slice";
import { Modal } from "../../common/modal/modal";

import "./login-modal.css";

export const LoginModal = () => {
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const forgotPasswordStep = useSelector(state => state.login.forgotPasswordStep);
    const userExists = useSelector(state => state.login.userExists);
    const confirmationCode = useSelector(state => state.register.confirmationCode);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [userConfirmationCode, setUserConfirmationCode] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [user, setUser] = useState({
        username: "",
        password: "",
    })

    const nextButtonExtraStyles = {
        borderRadius: "15px",
        fontSize: "15pt",
        fontFamily: "'Poppins', 'Outifit', sans-serif"
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signInUser = () => {
        dispatch(logInUser(user));
    }

    const resendVerificationCode = () => {
        dispatch(retrieveVerificationCode({email: user.email}))
        alert("A new code was sent to your email.")
    }

    const nextStep = useCallback(() => {
        switch(forgotPasswordStep) {
            case 1: 
                dispatch(verifyUserExists({username: user.username}))
                
                if (!userExists) {
                    alert(`User ${user.username} doesn't exist in our database. Please try again.`);
                    return;
                }

                dispatch(retrieveVerificationCode({email: loggedInUser.email}));
                dispatch(incrementStep())
                break;
            case 2: 
                if (userConfirmationCode !== confirmationCode) {
                    alert("That code doesn't match the one we sent you! Please try again.");
                    return;
                }

                dispatch(incrementStep())
                break;
            case 3: 
                if (user.password !== confirmPass) {
                    alert("The passwords don't match! Please try again.");
                    return;
                }
                
                dispatch(changePassword(user));
                dispatch(resetStepCounter());
                setForgotPassword(false);
        }
    }, [forgotPasswordStep, loggedInUser, user, confirmPass, userExists])

    const determineModalContent = () => {
        if (!forgotPassword) {
            return {
                topContent: (<h2 className="login-header">Sign In Here!</h2>),
                centerContent: (
                    <div className="login-wrapper">
                        <TextField className="login-text-field" variant="outlined" label="Username" onChange={(e) => setUser({...user, username: e.target.value})} />
                        <br />
                        <TextField className="login-text-field" variant="outlined" label="Password" onChange={(e) => setUser({...user, password: e.target.value})} type="password" />
                        <br />
                        <Button variant="text" onClick={() => setForgotPassword(true)}>Forgot Password?</Button>
                    </div>
                ),
                bottomContent: (
                    <Button 
                        className="login-next-button" 
                        variant="contained" 
                        sx={nextButtonExtraStyles}
                        onClick={signInUser}   
                    >Sign In</Button>
                )
            }
        }

        switch(forgotPasswordStep) {
            case 1: 
                return { 
                    topContent: (<h2 className="login-header">Recover your account</h2>),
                    centerContent: (
                        <div className="login-wrapper">
                            <TextField className="login-text-field" variant="outlined" label="Username" onChange={(e) => setUser({...user, username: e.target.value})} />
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className="login-next-button" 
                            variant="contained" 
                            sx={nextButtonExtraStyles}
                            onClick={nextStep}   
                        >
                            Send me a code
                        </Button>
                    )   
                }
            case 2: 
                return {
                    topContent: <h2 className='login-header'>We sent you a code!</h2>,
                    centerContent: (
                        <div className='login-wrapper'>
                            <TextField
                                variant='outlined'
                                label="Verification Code"
                                onChange={(e) => setUserConfirmationCode(e.target.value)}
                                className='login-text-field'
                                type='password'
                            />
                            <br />
                            <Button variant='text' onClick={resendVerificationCode}>Didn't receive a code?</Button>
                        </div>
                    ),
                    bottomContent: (
                        <Button 
                            className='login-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
                            disabled={Boolean(!userConfirmationCode)} 
                            onClick={nextStep}
                        >
                            Verify
                        </Button>
                    )
                }
            case 3: 
                return {
                    topContent: <h2 className="login-header">Change your password</h2>,
                    centerContent: (
                        <div className="login-wrapper">
                            <TextField
                                variant="outlined"
                                label="Password"
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                className="login-text-field"
                                type="password"
                            />
                            <br />
                            <TextField
                                variant="outlined"
                                label="Confirm Password"
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="login-text-field"
                                type="password"
                            />
                        </div>
                    ),
                    bottomContent: (
                        <Button
                            className='login-next-button' 
                            variant="contained" 
                            sx={nextButtonExtraStyles} 
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

    useMemo(() => {
        if (!userExists) {
            alert(`User ${user.username} doesn't exist in our database. Please try again.`);
            return;
        }

        dispatch(retrieveVerificationCode({email: loggedInUser.email}));
        dispatch(incrementStep())
    }, [userExists])

    useEffect(() => {
        // If the user is already logged in, send them home.
        if (loggedInUser && loggedInUser.accessToken) {
            alert(`Welcome, ${loggedInUser.first_name}!`)
            navigate("/home");  
        }
    }, [loggedInUser])

    return (
        <Modal 
            topContent={determineModalContent().topContent}
            centerContent={determineModalContent().centerContent}
            bottomContent={determineModalContent().bottomContent}
        />
    )
    
}