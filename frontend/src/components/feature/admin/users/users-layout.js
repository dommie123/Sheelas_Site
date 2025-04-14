import React from 'react';

import { Card } from '@mui/material';

import { AllUsersTable } from './index';

import './users-layout.css';

const UsersLayout = () => {
    return (
        <div className='users-layout-container'>
            <Card className='all-users-table-card'><AllUsersTable /></Card>
        </div>
    );
};

export default UsersLayout;