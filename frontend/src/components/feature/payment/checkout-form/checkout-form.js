import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js";

import { showError } from "../../../../utils/error";

import { Button } from "@mui/material";

import './checkout-form.css';

const CheckoutForm = () => {
    const checkout = useCheckout();
    const navigate = useNavigate();
    const user = useSelector(state => state.login.loggedInUser);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await checkout.confirm({
            // TODO create form elements for saving payment method and payment/shipping addresses.
            email: user.email,
            phoneNumber: user.phone,
        });

        if (result.type === 'error') {
            showError(result.error.message);
        }
    };

    const handleCancelTransaction = () => {
        navigate("/home");
    }

    return (
        <form className="checkout-form" onSubmit={handleSubmit}>
            <PaymentElement options={{ layout: 'accordion' }} />
            <div className="checkout-button-suite">
                <Button className="checkout-submit-btn" variant="contained" color="primary" type="submit">Submit</Button>
                <Button className="checkout-cancel-btn" variant="outlined" color="error" onClick={handleCancelTransaction}>Cancel</Button>
            </div>
        </form>
    );
};

export default CheckoutForm;
