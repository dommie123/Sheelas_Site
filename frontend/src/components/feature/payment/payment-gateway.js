import React from "react";
import { CheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./checkout-form/checkout-form";

import './payment-gateway.css';

export default function PaymentGateway() {
    // TODO get Stripe API key and replace Promise.resolve with loadStripe('<api-key>')
    const stripePromise = Promise.resolve(() => {});
    
    // TODO get client secret from backend
    const fetchClientSecret = () => {};

    return (
        <CheckoutProvider stripe={stripePromise} options={{fetchClientSecret}}>
            <CheckoutForm />
        </CheckoutProvider>
    )
}