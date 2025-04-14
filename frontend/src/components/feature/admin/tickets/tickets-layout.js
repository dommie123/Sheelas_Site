import React from 'react';

import { Card } from '@mui/material';

import { GuestTicketsTable, SupportTicketsTable } from './index'

import './tickets-layout.css';

const TicketsLayout = () => {
    return (
        <div className='tickets-layout-container'>
            <Card className='support-tickets-table-card'><SupportTicketsTable /></Card>
            <Card className='guest-tickets-table-card'><GuestTicketsTable /></Card>
        </div>
    );
};

export default TicketsLayout;