import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { setUserCheckedOut } from '../../../../slices/login-slice';
import { addItem } from '../../../../slices/cart-slice';

import ItemCard from '../../../common/item-card/item-card';

import { primaryButtonExtraStyles } from '../../../../styles/global-styles';
import './thank-you.css';

export default function ThankYouPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedItem = useSelector(state => state.items.selectedItem);
    const userCheckedOut = useSelector(state => state.login.userHasCheckedOut);

    useEffect(() => {
        return () => {
            const savedCartItems = JSON.parse(localStorage.getItem("cartItems"))

            if (savedCartItems) {
                savedCartItems.forEach(item => {
                    dispatch(addItem(item));
                });
            }

            localStorage.setItem("cartItems", null);
            dispatch(setUserCheckedOut(false));
        }
        // eslint-disable-next-line
    }, [])

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