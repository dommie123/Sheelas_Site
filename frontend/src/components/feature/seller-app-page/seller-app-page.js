import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

import { registerNewSeller } from '../../../slices/seller-slice';
import { addToMessageQueue } from '../../../slices/global-slice';
import { showError } from '../../../utils/error';

import { SellerPlanRadioGroup } from './seller-plan-radio-group/seller-plan-radio-group';

import './seller-app-page.css';

export default function SellerAppPage() {
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const [currentPlan, setCurrentPlan] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const planOptions = [
        {id: 1, name: "Individual", price: "5%", rateType: "item", details: [
            "Limit of 100 item listings",
            "Limit of $5,000 per listing",
            "Charged 5% of an item's price per item sold",
            "Inactive account is reverted after 1 year"
        ]},
        {id: 2, name: "Business", price: "$29.99", rateType: "mo", details: [
            "Limit of 200 item listings",
            "Limit of $10,000 per listing",
            "Fixed rate of $29.99 per month",
            "Account remains active until cancelled or deleted"
        ]}, // mo = month  
    ];

    const handlePlanChange = (newPlan) => {
        setCurrentPlan(newPlan);
    }

    const handleNextClicked = () => {
        // TODO have logic for submitting payment info
        if (!currentPlan) {
            showError("Please select a plan to continue!");
            return;
        }

        const newUserInfo = { ...loggedInUser, role: 3, seller_plan: currentPlan }
        dispatch(registerNewSeller({ 
            username: newUserInfo.username, 
            userData: newUserInfo, 
            userToken: newUserInfo.accessToken 
        }));

        // TODO navigate to thank you page
        dispatch(addToMessageQueue({severity: "success", message: "User has successfully been promoted to seller!"}));
        navigate("/home");
    }

    useEffect(() => {
        if (loggedInUser.role !== 2) {
            navigate('/error');
            return;
        }
        // eslint-disable-next-line
    }, [loggedInUser])

    return (
        <div className='seller-app-page-container'>
            <h2 className='seller-application-heading'>Choose your seller plan</h2>
            <SellerPlanRadioGroup
                options={planOptions}
                onChange={handlePlanChange}
            />
            <div className='seller-application-captcha-placeholder'>Captcha goes here</div> {/* TODO put actual captcha here */}
            <Button 
                className='seller-application-submit-btn' 
                variant="contained"
                color='primary'
                onClick={handleNextClicked}
            >
                Submit
            </Button>
        </div>
    )
}