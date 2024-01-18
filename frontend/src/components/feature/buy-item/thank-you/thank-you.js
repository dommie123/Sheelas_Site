import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import ItemCard from '../../../common/item-card/item-card';

import { primaryButtonExtraStyles } from '../../../../styles/global-styles';
import './thank-you.css';

export default function ThankYouPage() {
    const navigate = useNavigate();
    const selectedItem = useSelector(state => state.items.selectedItem);

    return (
        <div className='thank-you-container'>
            <h2 className='thank-you-header'>Thank you!</h2>
            <p className='thank-you-additional-message'>
                A confirmation email will be sent to your inbox confirming your purchase. We hope you enjoy!
            </p>
            <ItemCard {...selectedItem} itemId={selectedItem.id} isOnThankYouPage />
            <Button variant="contained" className='go-home-button' sx={primaryButtonExtraStyles} onClick={() => { navigate('/home') }}>Go Home</Button>
        </div>
    )
}