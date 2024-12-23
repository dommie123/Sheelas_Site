import React from 'react';
import { useDispatch } from 'react-redux';

import { Card, IconButton, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { toCurrencyFormat, fromCurrencyFormat } from '../../../utils/strings';

import './item-card.css';
import { removeItem } from '../../../slices/cart-slice';

export default function SmallItemCard(props) {
    const { itemId, name, price, quantity, productImageUrl } = props;
    const dispatch = useDispatch();
    // TODO have custom images for each item (but save for later, since I struggle with custom image display)
    const imageUrl = Boolean(productImageUrl) ? productImageUrl : `https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg`;
    const displayPrice = toCurrencyFormat(fromCurrencyFormat(price) * quantity);

    const handleRemoveItem = (event) => {
        event.preventDefault();
        dispatch(removeItem({ itemId, name, price, quantity }));
    }

    return  (
        <Card className='small-item-card-container' role="listitem" >
            <img className='small-item-image' src={imageUrl} alt='Placeholder small-item' aria-hidden="true" />
            <div className='small-item-text-content-wrapper'>
                <Typography variant='h6' component='h6' aria-label={`${name} Item Link ${name} Item Name`} className='small-item-title'>{name}</Typography>
                <Typography variant='p' component='p' aria-label={`${name} Item Link ${name} Item Quantity ${quantity}`}className='small-item-quantity'>Qty: {quantity}</Typography>
                <Typography variant='p' component='p' aria-label={`${name} Item Link ${name} Item Price ${price}`} className='small-item-price'>{displayPrice}</Typography>
            </div>
            <IconButton color='error' className='small-item-delete-btn' aria-label={`Delete ${name} from cart`} onClick={handleRemoveItem}>
                <DeleteForeverIcon />
            </IconButton>
        </Card>
    )
    
}