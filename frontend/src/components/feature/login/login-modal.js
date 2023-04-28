import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { TextField, Link, Button, } from "@mui/material";

import { logInUser } from "../../../slices/login-slice";
import { Modal } from "../../common/modal/modal";

import "./login-modal.css";

export const LoginModal = () => {
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const [user, setUser] = useState({
        username: "",
        password: "",
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signInUser = () => {
        dispatch(logInUser(user));
    }

    useEffect(() => {
        // If the user is already logged in, send them home.
        if (loggedInUser && loggedInUser.accessToken) {
            alert(`Welcome, ${loggedInUser.first_name}!`)
            navigate("/home");  
        }
    }, [loggedInUser])

    return (
        <Modal 
            topContent={<h2 className="login-header">Sign In Here!</h2>}
            centerContent={
                <div className="login-wrapper">
                    <TextField className="login-text-field" variant="outlined" label="Username" onChange={(e) => setUser({...user, username: e.target.value})} />
                    <br />
                    <TextField className="login-text-field" variant="outlined" label="Password" onChange={(e) => setUser({...user, password: e.target.value})} type="password" />
                    <br />
                    <Button variant="text">Forgot Password?</Button>
                </div>
            }
            bottomContent={
                <Button 
                    className="login-next-button" 
                    variant="contained" 
                    sx={
                        { 
                            borderRadius: "15px",
                            fontSize: "15pt",
                            fontFamily: "'Poppins', 'Outifit', sans-serif"
                        }
                    }
                    onClick={signInUser}   
                >Sign In</Button>
            }
        />
    )
}