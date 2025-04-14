import React from 'react';

import { Card, Typography } from '@mui/material';

import { AllUsersTable } from '../users';
import { SupportTicketsTable, GuestTicketsTable } from '../tickets';

import './dashboard-layout.css';

const DashboardLayout = () => {
    return (
        <div className='dashboard-layout-container'>
            <Card className="sheebay-website-visit-count-card">
                <Typography variant='h6' component='b'>Visits: 10</Typography>
            </Card>
            <Card className='sheebay-total-sales-to-visits-card'>
                <p>Total Sales and Visits</p>
            </Card>
            <Card className='sheebay-users-card'><AllUsersTable /></Card>
            <Card className='sheebay-support-tickets-card'><SupportTicketsTable /></Card>
            <Card className='sheebay-guest-support-tickets-card'><GuestTicketsTable /></Card>
        </div>
    );
};

export default DashboardLayout;