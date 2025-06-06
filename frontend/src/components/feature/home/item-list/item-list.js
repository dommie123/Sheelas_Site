import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ItemCard from '../../../common/item-card/item-card';
import { getItems } from '../../../../slices/item-slice';
import { toCurrencyFormat } from '../../../../utils/strings';

import './item-list.css';

export default function ItemList() {
    const items = useSelector(state => state.items.items);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getItems());
        // eslint-disable-next-line
    }, [items.legnth]);

    return (
        <div className='item-list-container' role='list' aria-label='Items '>
            {items.length > 0 
                ? items.map(item => <ItemCard 
                    itemId={item.id} 
                    name={item.name} 
                    description={item.description} 
                    price={toCurrencyFormat(item.price)} 
                    quantity={item.quantity} 
                    productImageUrl={item.image_url}
                    seller_id={item.seller_id} 
                />) 
                : <></>
            }
        </div>
    )
}