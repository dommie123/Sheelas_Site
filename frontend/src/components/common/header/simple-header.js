import React from "react";
import { Link, useNavigate,  } from 'react-router-dom'
import { useSelector } from "react-redux";

import { Button } from '@mui/material';

import headerLogo from '../../../assets/SheeBay_Logo_Draft_1.png';
import mobileHeaderLogo from '../../../assets/SheeBay_Logo_Draft_2.png';
import './header.css';

export const Header = (props) => {
    const navigate = useNavigate();
    const isMobile = useSelector(state => state.global.isMobile);

    const handleSignIn = () => {
        navigate("/login");
    }

    const handleSignUp = () => {
        navigate("/register");
    }

    return (
        <header className="signout-header">
            <Link className="header-title-link" to="/"><img className="header-title-image" src={ isMobile ? mobileHeaderLogo : headerLogo } alt="SheeBay Logo" /></Link>
            <div className="header-button-suite">
                <Button variant="contained" className="sign-in-button" onClick={handleSignIn}>Sign In</Button>
                <Button variant="outlined" className="sign-up-button" onClick={handleSignUp}>Sign Up</Button>
            </div>
        </header>
    )
}