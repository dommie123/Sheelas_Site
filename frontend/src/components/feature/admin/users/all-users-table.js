import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAllUsers } from '../../../../slices/admin-slice';

import DataTable from '../../../common/data-table/data-table';

export default function AllUsersTable() {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const allUsers = useSelector(state => state.admin.allUsers);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUsers());
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!allUsers) {
            return;
        }

        if (allUsers.length === 0) {
            return;
        }

        setColumns(Object.keys(allUsers[0]));
        setData(allUsers);
    }, [allUsers])
    
    return (
        <DataTable 
            className='sheebay-users-table'
            columns={columns}
            data={data}
            title="All Users"
            maxHeight="150px"
            width="100%"
        />
    )
}