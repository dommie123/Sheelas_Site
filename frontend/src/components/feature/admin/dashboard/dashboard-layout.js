import React from 'react';

import { Card, Typography } from '@mui/material';
import DataTable from '../../../common/data-table/data-table';

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
            <Card className='sheebay-users-card'>
                <DataTable 
                    className='sheebay-users-table'
                    columns={[
                        "firstName",
                        "lastName",
                        "email",
                        "phone"
                    ]}
                    data={[
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                    ]}
                    title="All Users"
                    maxHeight="150px"
                    width="100%"
                />
            </Card>
            <Card className='sheebay-support-tickets-card'>
                <DataTable 
                    className='sheebay-support-tickets-table'
                    columns={[
                        "firstName",
                        "lastName",
                        "email",
                        "phone"
                    ]}
                    data={[
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                    ]}
                    title="Support Tickets"
                    maxHeight="150px"
                    width="100%"
                />
            </Card>
            <Card className='sheebay-guest-support-tickets-card'>
                <DataTable 
                    className='sheebay-guest-support-tickets-table'
                    columns={[
                        "firstName",
                        "lastName",
                        "email",
                        "phone"
                    ]}
                    data={[
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                        {firstName: "Jane", lastName: "Dough", email: "janedough69@gmail.com", phone: "555-555-5555"},
                    ]}
                    title="Guest Support Tickets"
                    maxHeight="150px"
                    width="100%"
                />
            </Card>
        </div>
    );
};

export default DashboardLayout;