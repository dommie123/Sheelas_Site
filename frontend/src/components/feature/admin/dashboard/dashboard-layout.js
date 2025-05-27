import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Card, Typography } from '@mui/material';

import { getTotalSiteVisits } from '../../../../slices/admin-slice';

import { AllUsersTable } from '../users';
import { SupportTicketsTable, GuestTicketsTable } from '../tickets';

import './dashboard-layout.css';

const DashboardLayout = () => {
    const totalVisits = useSelector(state => state.admin.totalVisits);
    const [visitsDisplay, setVisitsDisplay] = useState("Loading Visits...");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTotalSiteVisits());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        switch (typeof totalVisits) {
            case "undefined":
                setVisitsDisplay("Loading Visits...");
                break;
            case "number":
                setVisitsDisplay(`Total Website Visits: ${totalVisits}`);
                break;
            default: 
                console.log(typeof totalVisits);
                setVisitsDisplay("An error occurred! Please refresh the page.");
                break;
        }
    }, [totalVisits]);
    return (
        <div className='dashboard-layout-container'>
            <Card className="sheebay-website-visit-count-card">
                <Typography variant='h6' component='b'>{visitsDisplay}</Typography>
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