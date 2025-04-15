import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getGuestSupportTickets } from '../../../../slices/admin-slice';

import DataTable from '../../../common/data-table/data-table';

export default function GuestTicketsTable() {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const guestSupportTickets = useSelector(state => state.admin.guestSupportTickets);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGuestSupportTickets());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!guestSupportTickets) {
            return;
        }

        if (guestSupportTickets.length === 0) {
            return;
        }

        setColumns(Object.keys(guestSupportTickets[0]));
        setData(guestSupportTickets);
    }, [guestSupportTickets]);

    return (
        <DataTable 
            className='sheebay-guest-support-tickets-table'
            columns={columns}
            data={data}
            title="Guest Support Tickets"
            maxHeight="150px"
            width="100%"
        />
    )
}