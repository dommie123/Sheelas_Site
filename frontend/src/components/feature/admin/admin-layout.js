// React Imports
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Custom Components
import Tabs from '../../common/tabs/simple-tabs';

// Layout Imports
import DashboardLayout from './dashboard/dashboard-layout';
import UsersLayout from './users/users-layout';
import TicketsLayout from './tickets/tickets-layout';

// Style Imports
import './admin-layout.css';

const AdminLayout = () => {
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const navigate = useNavigate();

    const adminTabs = [
        { label: "Dashboard", content: <DashboardLayout /> },
        { label: "Tickets", content: <TicketsLayout /> },
        { label: "Users", content: <UsersLayout /> }
    ];

    // If the user is not a site administrator, navigate them to the home page.
    useEffect(() => {
        if (Boolean(loggedInUser.id) && loggedInUser.role !== 1) {
            // TODO navigate user to error page with error message.
            navigate('/home');
        }
        // eslint-disable-next-line
    }, [loggedInUser]);

    return (
        <div className='admin-layout-container'>
            <Tabs className='admin-tabs' tabs={adminTabs} />
        </div>
    );
};

export default AdminLayout;