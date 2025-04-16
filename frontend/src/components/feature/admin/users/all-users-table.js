import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAllUsers } from '../../../../slices/admin-slice';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DataTable from '../../../common/data-table/data-table';

export default function AllUsersTable({ showActions }) {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const allUsers = useSelector(state => state.admin.allUsers);
    const dispatch = useDispatch();

    const actions = showActions 
        ? [
            { label: <><RemoveCircleOutlineIcon sx={{ marginRight: 5 }} />Remove User</>, onClick: (event, dataEntry) => { console.log(`Removed ${dataEntry.username}!`); }},
            { label: <><PersonRemoveIcon sx={{ marginRight: 5 }} />Demote Admin</>, onClick: (event, dataEntry) => { console.log(`Demoted ${dataEntry.username}!`); }},
        ]
        : [];
    
    // TODO add handler functions for remove and add user

    useEffect(() => {
        if (allUsers.length !== 0) {
            return;
        }

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
            actions={actions}
            columns={columns}
            data={data}
            title="All Users"
            maxHeight="150px"
            width="100%"
        />
    )
}