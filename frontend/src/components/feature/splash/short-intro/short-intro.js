import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import './short-intro.css';

export default function ShortIntro() {
    const navigate = useNavigate();

    const handleLearnMore = () => {
        navigate('/about');
    }

    return (
        <div className="short-intro-container">
            <h2 className="short-intro-heading">Welcome!</h2>
            <p className="short-intro-paragraph">
                I'm Sheela! I make art and sell it here! Have something to sell? Sell it here!
            </p>
            <Button variant="outlined" color="primary" onClick={handleLearnMore}>Learn More</Button>
        </div>
    ) 
}