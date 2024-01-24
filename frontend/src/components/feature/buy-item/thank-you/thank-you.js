import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { setUserCheckedOut } from '../../../../slices/login-slice';
import { toCurrencyFormat } from '../../../../utils/strings';

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
            dispatch(setUserCheckedOut(false));
        }
    }, [])

    return (
        <div className='thank-you-container'>
            <h2 className='thank-you-header'>Thank you!</h2>
            <p className='thank-you-additional-message'>
                A confirmation email with your receipt will be sent to your inbox confirming your purchase. We hope you enjoy!
            </p>
            {userCheckedOut ? <></> : <ItemCard {...selectedItem} price={toCurrencyFormat(selectedItem.price)} itemId={selectedItem.id} isOnThankYouPage />}
            <Button variant="contained" className='go-home-button' sx={primaryButtonExtraStyles} onClick={() => { navigate('/home') }}>Go Home</Button>
        </div>
    )
}