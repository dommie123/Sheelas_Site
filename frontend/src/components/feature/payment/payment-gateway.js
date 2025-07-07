import React from "react";
import { useSelector } from "react-redux";

import { authPostRequest } from '../../../utils/axios-helpers';
import { showError } from '../../../utils/error';
import { fromCurrencyFormat } from "../../../utils/strings";

import { CheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./checkout-form/checkout-form";

import configs from '../../../configs.json'; 

import './payment-gateway.css';

const stripePromise = loadStripe(configs.stripe_publishable_key);

export default function PaymentGateway() {
    const items = useSelector(state => state.cart.items);
    const user = useSelector(state => state.login.loggedInUser);
    const selectedSellerPlan = useSelector(state => state.seller.selectedPlan);

    const fetchClientSecret = async () => {
        const hasSellerPlan = Boolean(selectedSellerPlan);
        const modifiedItems = items.map(item => { return {...item, price: fromCurrencyFormat(item.price) * 100} }); // Convert price from cents to dollars
        try {
            const res = await authPostRequest(`create-${hasSellerPlan ? 'subscription-' : '' }checkout-session`, { items: modifiedItems, user }, user.accessToken);
            return res.data.checkoutSessionClientSecret;
        } catch (err) {
            return showError(err.message);
        }
    };

    return (
        <CheckoutProvider stripe={stripePromise} options={{fetchClientSecret}}>
            <CheckoutForm />
        </CheckoutProvider>
    )
}