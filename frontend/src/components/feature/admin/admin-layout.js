// React Imports
import React from 'react';

// Custom Components
import Tabs from '../../common/tabs/simple-tabs';

// Layout Imports
import DashboardLayout from './dashboard/dashboard-layout';
import UsersLayout from './users/users-layout';
import TicketsLayout from './tickets/tickets-layout';

// Style Imports
import './admin-layout.css';

const AdminLayout = () => {
    const adminTabs = [
        { label: "Dashboard", content: <DashboardLayout /> },
        { label: "Tickets", content: <TicketsLayout /> },
        { label: "Users", content: <UsersLayout /> }
    ];

    return (
        <div className='admin-layout-container'>
            <Tabs className='admin-tabs' tabs={adminTabs} />
        </div>
    );
};

export default AdminLayout;