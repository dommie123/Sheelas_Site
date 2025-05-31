import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Card, Typography } from '@mui/material';

import { getTotalSales, getTotalSiteVisits } from '../../../../slices/admin-slice';

import { AllUsersTable } from '../users';
import { SupportTicketsTable, GuestTicketsTable } from '../tickets';

import './dashboard-layout.css';

const DashboardLayout = () => {
    const totalVisits = useSelector(state => state.admin.totalVisits);
    const totalSales = useSelector(state => state.admin.totalSales);
    const [visitsDisplay, setVisitsDisplay] = useState("Loading Visits...");
    const [salesDisplay, setSalesDisplay] = useState("Loading Sales...");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTotalSiteVisits());
        dispatch(getTotalSales());
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

    useEffect(() => {
        switch (typeof totalSales) {
            case "undefined":
                setSalesDisplay("Loading Sales...");
                break;
            case "number":
                setSalesDisplay(`Total Website Sales: ${totalSales}`);
                break;
            default: 
                console.log(typeof totalSales);
                setSalesDisplay("An error occurred! Please refresh the page.");
                break;
        }
    }, [totalSales]);
    return (
        <div className='dashboard-layout-container'>
            <Card className="sheebay-website-visit-count-card">
                <Typography variant='h6' component='b'>{visitsDisplay}</Typography>
            </Card>
            <Card className='sheebay-total-sales-to-visits-card'>
                <Typography variant='h6' component='b'>{salesDisplay}</Typography>
            </Card>
            <Card className='sheebay-users-card'><AllUsersTable /></Card>
            <Card className='sheebay-support-tickets-card'><SupportTicketsTable /></Card>
            <Card className='sheebay-guest-support-tickets-card'><GuestTicketsTable /></Card>
        </div>
    );
};

export default DashboardLayout;