import React from "react";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "@mui/material";

import './checkout-form.css';

const CheckoutForm = () => {
    const checkout = useCheckout();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await checkout.confirm();

        if (result.type === 'error') {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button variant="filled" color="primary">Submit</Button>
        </form>
    );
};

export default CheckoutForm;
