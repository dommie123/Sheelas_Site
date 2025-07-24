import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { getUserFromSession, setUserCheckedOut } from '../../../../slices/login-slice';
import { changeUserSettings } from '../../../../slices/login-slice';
import { addItem } from '../../../../slices/cart-slice';

import { objectIsEmpty } from '../../../../utils/objects';

import ItemCard from '../../../common/item-card/item-card';

import { primaryButtonExtraStyles } from '../../../../styles/global-styles';
import './thank-you.css';

export default function ThankYouPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.loggedInUser);
    const selectedItem = useSelector(state => state.items.selectedItem);
    const userCheckedOut = useSelector(state => state.login.userHasCheckedOut);

    const handlePaymentSuccess = () => {
        // Check to see if user has purchased a seller plan before making them a seller
        const hasSellerPlan = Boolean(localStorage.getItem("sellerPlan"));
        let selectedSellerPlan;

        if (hasSellerPlan) {
            selectedSellerPlan = Number.parseInt(localStorage.getItem("sellerPlan"));

            dispatch(changeUserSettings({ 
                user: { 
                    ...user, 
                    role: 3, 
                    seller_plan: selectedSellerPlan
                }, 
                accessToken: user.accessToken
            }));

            localStorage.setItem("sellerPlan", null);
        } else {
            const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));

            if (savedCartItems) {
                savedCartItems.forEach(item => {
                    dispatch(addItem(item));
                });
            }

            localStorage.setItem("cartItems", null);
        }

        dispatch(setUserCheckedOut(false));
        // eslint-disable-next-line
    }

    useEffect(() => {
        const hasSellerPlan = Boolean(localStorage.getItem("sellerPlan"))

        if (hasSellerPlan) {
            dispatch(getUserFromSession());
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        return objectIsEmpty(user) ? () => {} : handlePaymentSuccess();
        // eslint-disable-next-line
    }, [user])

    return (
        <div className='thank-you-container'>
            <h2 className='thank-you-header' aria-label='Thank you'>Thank you!</h2>
            <p className='thank-you-additional-message'>
                A confirmation email with your receipt will be sent to your inbox confirming your purchase. We hope you enjoy!
            </p>
            {userCheckedOut ? <></> : <ItemCard 
                {...selectedItem} 
                productImageUrl={selectedItem.productImageUrl} 
                price={selectedItem.price} 
                itemId={selectedItem.id} 
                isOnThankYouPage 
            />}
            <Button 
                variant="contained" 
                className='go-home-button' 
                sx={primaryButtonExtraStyles} 
                onClick={() => { navigate('/home') }}
                aria-label='Go Home'
            >
                Go Home
            </Button>
        </div>
    )
}