import React from "react";
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@mui/material';

import './header.css';

export const Header = (props) => {
    const title = props.title;
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate("/login");
    }

    const handleSignUp = () => {
        navigate("/register");
    }

    return (
        <header className="signout-header">
            <h1 className="header-title-text"><Link className="header-title-link" to="/">{title}</Link></h1>
            <div className="header-button-suite">
                <Button variant="contained" className="sign-in-button" onClick={handleSignIn}>Sign In</Button>
                <Button variant="outlined" className="sign-up-button" onClick={handleSignUp}>Sign Up</Button>
            </div>
        </header>
    )
}