import React, { useState } from "react";
import { useSelector } from "react-redux";

import { LinearProgress } from "@mui/material";

import { CheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

import { SELLER_PLAN_OPTIONS } from "../../../lib/constants";

import { authPostRequest } from '../../../utils/axios-helpers';
import { showError } from '../../../utils/error';
import { fromCurrencyFormat } from "../../../utils/strings";

import CheckoutForm from "./checkout-form/checkout-form";

import configs from '../../../configs.json'; 

import './payment-gateway.css';

const stripePromise = loadStripe(configs.stripe_publishable_key);

export default function PaymentGateway() {
    const items = useSelector(state => state.cart.items);
    const user = useSelector(state => state.login.loggedInUser);
    const selectedSellerPlan = useSelector(state => state.seller.selectedPlan);
    const [isLoading, setLoading] = useState(true);

    const hasSellerPlan = Boolean(selectedSellerPlan);
    localStorage.setItem("sellerPlan", `${selectedSellerPlan}`);

    const fetchClientSecret = async () => {
        const modifiedItems = items.map(item => { return {...item, price: item.price * 100} }); // Convert price from cents to dollars

        try {
            let res;

            if (hasSellerPlan) {
                const currentSellerPlan = SELLER_PLAN_OPTIONS[selectedSellerPlan - 1];
                res = await authPostRequest('checkout/create-subscription-checkout-session', { 
                    user, 
                    sellerPlan: {
                        ...currentSellerPlan,
                        price: fromCurrencyFormat(currentSellerPlan.price)
                    }}, 
                user.accessToken);
            } else {
                res = await authPostRequest(`checkout/create-checkout-session`, { 
                    items: modifiedItems,
                    user 
                }, 
                user.accessToken);
            }

            if (!hasSellerPlan) {
                return res.data.checkoutSessionClientSecret;
            } else {
                window.location.href = res.data.checkoutSessionUrl;
            }
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {hasSellerPlan ? <p>You are being redirected to the checkout page. Please wait...</p> : <></>}
            {isLoading ? <LinearProgress color="success" /> : <></>}
            <CheckoutProvider stripe={stripePromise} options={{fetchClientSecret}}>
                <CheckoutForm />
            </CheckoutProvider>
        </>
    )
}