import React from 'react';

import ItemList from './item-list/item-list';

import './home.css';

export default function HomePage() {

    return (
        <div className='home-container'>
            <div className='home-content'>
                <ItemList />
            </div>
        </div>
    )
}