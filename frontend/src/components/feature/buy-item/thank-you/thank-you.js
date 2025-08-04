import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { getUserFromSession } from '../../../../slices/login-slice';
import { changeUserSettings } from '../../../../slices/login-slice';
import { checkoutItems } from '../../../../slices/cart-slice';

import { objectIsEmpty } from '../../../../utils/objects';
// import { showError } from '../../../../utils/error';

import ItemCard from '../../../common/item-card/item-card';

import { primaryButtonExtraStyles } from '../../../../styles/global-styles';
import './thank-you.css';

export default function ThankYouPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.loggedInUser);
    // const userCheckedOut = useSelector(state => state.login.userHasCheckedOut);
    const [userCheckedOut, setUserCheckedOut] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const handlePaymentSuccess = () => {
        // Check to see if user has purchased a seller plan before making them a seller
        const hasSellerPlan = localStorage.getItem("sellerPlan") !== "null";
        const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));

        if (savedCartItems.length > 0) {
            handlePurchasedCartItems(savedCartItems);
        } else if (hasSellerPlan) {
            handlePurchasedSellerPlan();
        } 

        setUserCheckedOut(false);
        // eslint-disable-next-line
    }

    const handlePurchasedSellerPlan = () => {
        const selectedSellerPlan = Number.parseInt(localStorage.getItem("sellerPlan"));

        dispatch(changeUserSettings({ 
            user: { 
                ...user, 
                role: 3, 
                seller_plan: selectedSellerPlan
            }, 
            accessToken: user.accessToken
        }));

        localStorage.setItem("sellerPlan", null);
    }

    // const handleBuyNowPaymentSuccess = (savedItem) => {
    //     try {
    //         // If the user has bought an item, carry it over from localStorage before freeing the memory.
    //         const parsedSavedItem = JSON.parse(savedItem);

    //         setSelectedItem(parsedSavedItem);
    //         dispatch(checkoutItems({
    //             items: [
    //                 parsedSavedItem
    //             ],
    //             user,
    //             accessToken: user.accessToken
    //         }))
    //         localStorage.setItem("selectedItem", null);
    //     } catch (err) {
    //         showError(err.message);
    //     }
    // }

    const handlePurchasedCartItems = (savedCartItems) => {
        dispatch(checkoutItems({ items: savedCartItems, user, accessToken: user.accessToken }));
        localStorage.setItem("cartItems", "[]");
    }

    const purchasedItemCard = useMemo(() => {
        return Boolean(selectedItem) ? 
            <ItemCard 
                {...selectedItem} 
                productImageUrl={selectedItem.productImageUrl} 
                price={selectedItem.price} 
                itemId={selectedItem.id} 
                isOnThankYouPage 
            /> : <></>
    }, [selectedItem])

    useEffect(() => {
        if (objectIsEmpty(user)) {
            dispatch(getUserFromSession()); 
        } else if (userCheckedOut) {
            handlePaymentSuccess();
        }
        
        // eslint-disable-next-line
    }, [user, userCheckedOut])

    // useEffect(() => {
    //     return objectIsEmpty(user) && userCheckedOut ? () => {} : handlePaymentSuccess();
    //     // eslint-disable-next-line
    // }, [user, userCheckedOut])

    return (
        <div className='thank-you-container'>
            <h2 className='thank-you-header' aria-label='Thank you'>Thank you!</h2>
            <p className='thank-you-additional-message'>
                A confirmation email with your receipt will be sent to your inbox confirming your purchase. We hope you enjoy!
            </p>
            {userCheckedOut ? <></> : purchasedItemCard}
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