import React from 'react';
import { Card } from '@mui/material';

import { capitalize } from '../../../../utils/strings';

import './seller-plan-card.css';

export const SellerPlanCard = ({ option, onClick, className, children }) => {
    return (
        <Card 
            className={`${className} seller-plan-card`}
            onClick={onClick}
        >
            <h2 className='seller-plan-option-heading'>{capitalize(option)}</h2>
            {children}
        </Card>
    )
}