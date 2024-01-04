import React from 'react';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';

import './item-card.css';

export default function ItemCard(props) {
    const {name, description, price, quantity} = props;
    // TODO have custom images for each item (but save for later, since I struggle with custom image display)
    const placeholderImgUrl = `https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg`;

    return  (
        <Card className='item-card-container'>
            <img className='item-image' src={placeholderImgUrl} alt='Placeholder Item' />
            <div className='item-text-content-wrapper'>
                <Typography variant='h5' component='h5' className='item-title'>{name}</Typography>
                <Typography variant='p' component='p' className='item-decsription'>{description}</Typography>
                <Typography variant='p' component='p' className='item-price'>{price}</Typography>
                {quantity < 10 && (<Typography variant='p' component='p' className='item-low-quantity-messsage'>Only {quantity} left! Order now!</Typography>)}
            </div>
        </Card>
    )
    
}