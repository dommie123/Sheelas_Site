import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSupportTickets } from '../../../../slices/admin-slice';

import DataTable from '../../../common/data-table/data-table';

export default function SupportTicketsTable() {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const supportTickets = useSelector(state => state.admin.supportTickets);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSupportTickets());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!supportTickets) {
            return;
        }

        if (supportTickets.length === 0) {
            return;
        }

        setColumns(Object.keys(supportTickets[0]));
        setData(supportTickets);
    }, [supportTickets]);

    return (
        <DataTable 
            className='sheebay-support-tickets-table'
            columns={columns}
            data={data}
            title="Support Tickets"
            maxHeight="150px"
            width="100%"
        />
    )
}