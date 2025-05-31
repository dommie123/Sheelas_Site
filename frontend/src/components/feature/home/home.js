import React from 'react';
import { useSelector } from 'react-redux';

import ItemFilter from './item-filter/item-filter';
import ItemList from './item-list/item-list';
import SellerApplicationPanel from './seller-app-panel/seller-app-panel';

import './home.css';

export default function HomePage() {
    const user = useSelector(state => state.login.loggedInUser);

    return (
        <div className='home-container'>
            <div className='home-content'>
                <ItemFilter />
                <ItemList />
                {user.role === 2 && <SellerApplicationPanel />}
            </div>
        </div>
    )
}