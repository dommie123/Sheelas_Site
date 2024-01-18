import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';

import { setSelectedItem } from '../../../slices/item-slice';

import './item-card.css';

export default function ItemCard(props) {
    const {itemId, seller_id, name, description, price, quantity, isOnThankYouPage} = props;
    // TODO have custom images for each item (but save for later, since I struggle with custom image display)
    const placeholderImgUrl = `https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg`;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLinkClick = (event) => {
        dispatch(setSelectedItem({ ...props, seller_id, id: itemId, itemId: undefined }));

        navigate('/buy');

        event.preventDefault();
    }

    return  (
        <Card className='item-card-container'>
            <a onClick={handleLinkClick} href='/buy' className='select-item-link'><img className='item-image' src={placeholderImgUrl} alt='Placeholder Item' /></a>
            <div className='item-text-content-wrapper'>
                <a onClick={handleLinkClick} href='/buy' className='select-item-link'><Typography variant='h5' component='h5' className='item-title'>{name}</Typography></a>
                <a onClick={handleLinkClick} href='/buy' className='select-item-link'><Typography variant='p' component='p' className='item-decsription'>{description}</Typography></a>
                <a onClick={handleLinkClick} href='/buy' className='select-item-link'><Typography variant='p' component='p' className='item-price'>{price}</Typography></a>
                {((quantity < 10 && quantity > 0) && !isOnThankYouPage) && (<Typography variant='p' component='p' className='item-low-quantity-messsage'>Only {quantity} left! Order now!</Typography>)}
            </div>
        </Card>
    )
    
}