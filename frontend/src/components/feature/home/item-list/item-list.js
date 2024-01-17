import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ItemCard from '../../../common/item-card/item-card';
import { getItems } from '../../../../slices/item-slice';

import './item-list.css';

export default function ItemList() {
    const items = useSelector(state => state.items.items);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getItems());
        // eslint-disable-next-line
    }, []);

    return (
        <div className='item-list-container'>
            {items.length > 0 ? items.map(item => <ItemCard itemId={item.id} name={item.name} description={item.description} price={`$${Number.parseFloat(item.price).toFixed(2)}`} quantity={item.quantity} seller_id={item.seller_id} />) : <></>}
        </div>
    )
}