import React from 'react';

import { Card, IconButton, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import './item-card.css';

export default function SmallItemCard(props) {
    const { name, price, quantity } = props;
    // TODO have custom images for each item (but save for later, since I struggle with custom image display)
    const placeholderImgUrl = `https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg`;

    return  (
        <Card className='small-item-card-container'>
            <img className='small-item-image' src={placeholderImgUrl} alt='Placeholder small-item' />
            <div className='small-item-text-content-wrapper'>
                <Typography variant='h6' component='h6' className='small-item-title'>{name}</Typography>
                <Typography variant='p' component='p' className='small-item-quantity'>Qty: {quantity}</Typography>
                <Typography variant='p' component='p' className='small-item-price'>{price}</Typography>
            </div>
            <IconButton color='error' className='small-item-delete-btn'>
                <DeleteForeverIcon />
            </IconButton>
        </Card>
    )
    
}