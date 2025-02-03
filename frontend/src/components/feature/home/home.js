import React from 'react';

import ItemFilter from './item-filter/item-filter';
import ItemList from './item-list/item-list';
import SellerApplicationPanel from './seller-app-panel/seller-app-panel';

import './home.css';

export default function HomePage() {

    return (
        <div className='home-container'>
            <div className='home-content'>
                <ItemFilter />
                <ItemList />
                <SellerApplicationPanel />
            </div>
        </div>
    )
}