import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js";

import { showError } from "../../../../utils/error";

import { addToMessageQueue } from "../../../../slices/global-slice";
import { checkoutItems } from '../../../../slices/cart-slice';
import { registerNewSeller } from "../../../../slices/seller-slice";

import { Button } from "@mui/material";

import './checkout-form.css';

const CheckoutForm = () => {
    const checkout = useCheckout();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const items = useSelector(state => state.cart.items);
    const user = useSelector(state => state.login.loggedInUser);
    const currentPlan = useSelector(state => state.seller.selectedPlan);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await checkout.confirm();

        if (result.type === 'error') {
            showError(result.error.message);
        } else {
            try {
                if (currentPlan) {
                    handleCompleteSubscriptionTransaction();
                } else {
                    handleCompleteCartTransaction();
                }
            } catch (err) {
                showError(err.message);
            }
        }
    };

    const handleCompleteCartTransaction = () => {
        dispatch(checkoutItems({ items, user, accessToken: user.accessToken }));
        navigate('/thank-you');
    }

    const handleCompleteSubscriptionTransaction = () => {
        const newUserInfo = { ...user, role: 3, seller_plan: currentPlan }
        dispatch(registerNewSeller({ 
            username: newUserInfo.username, 
            userData: newUserInfo, 
            userToken: newUserInfo.accessToken 
        }));

        dispatch(addToMessageQueue({severity: "success", content: "User has successfully been promoted to seller!"}));
        navigate("/thank-you");
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement options={{ layout: 'accordion' }} />
            <Button variant="filled" color="primary" type="submit">Submit</Button>
        </form>
    );
};

export default CheckoutForm;
