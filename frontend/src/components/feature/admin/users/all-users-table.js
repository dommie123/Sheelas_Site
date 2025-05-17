import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button, IconButton } from '@mui/material';

import { getAllUsers } from '../../../../slices/admin-slice';
import { changeUserSettings } from '../../../../slices/login-slice';

import { showError } from '../../../../utils/error';
import { authDeleteRequest } from '../../../../utils/axios-helpers';
import { alertUser } from '../../../../utils/alert-helpers';

import DataTable from '../../../common/data-table/data-table';
import { Modal } from '../../../common/modal/modal';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloseIcon from '@mui/icons-material/Close';

import './all-users-table.css';

export default function AllUsersTable({ showActions }) {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [modalState, setModalState] = useState(0);    // 0 - inactive, 1 - remove user, 2 - demote admin
    const [selectedUser, setSelectedUser] = useState({});
    const allUsers = useSelector(state => state.admin.allUsers);
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const dispatch = useDispatch();

    const refreshUserTable = (forceRefresh = false) => {
        if (allUsers.length !== 0 && !forceRefresh) {
            return;
        }

        dispatch(getAllUsers());
    }

    const handleRemoveUser = (event, userEntry) => {
        if (userEntry.id === loggedInUser.id) {
            showError("You cannot remove yourself from the database.");
            return;
        }

        setModalState(1);
        setSelectedUser(userEntry);
    }

    const handleDemoteAdmin = (event, userEntry) => {
        if (userEntry.id === loggedInUser.id) {
            showError("You cannot demote yourself from this page. Please do this from the Profile Settings instead.");
            return;
        }

        if (userEntry.role !== 1) {
            showError(`${userEntry.first_name} is not an admin!`);
            return;
        }

        setModalState(2);
        setSelectedUser(userEntry);
    }

    const handleCloseModal = () => {
        setModalState(0);
        setSelectedUser(null);
    }

    const handleConfirmRemoveUser = async () => {
        try {
            const response = await authDeleteRequest(`user/${selectedUser.username}`, loggedInUser.accessToken);
            alertUser(response.data.message);
        } catch (e) {
            showError(e);
        }

        refreshUserTable();
        handleCloseModal();
    }

    const handleConfirmDemoteAdmin = () => {
        dispatch(changeUserSettings({ user: { ...selectedUser, role: 3 }, accessToken: loggedInUser.accessToken}));
        alertUser(`${selectedUser.first_name} has been demoted successfully!`);
        refreshUserTable(true);
        handleCloseModal();
    }

    const determineModalContent = () => {
        switch (modalState) {
            case 1: 
                return {
                    topContent: <>
                        <IconButton className='confirm-user-removal-modal-close-btn' onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                        <h2 className='confirm-user-removal-header'>Please confirm</h2>
                    </>,
                    centerContent: <p className='confirm-user-removal-paragraph'>Are you sure you want to remove {selectedUser.first_name} from the database?</p>,
                    bottomContent: <div className='confirm-user-removal-button-suite'>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            className='confirm-user-removal-yes-btn' 
                            onClick={handleConfirmRemoveUser}
                        >
                            Yes
                        </Button>
                        <Button 
                            variant='outlined' 
                            color='error' 
                            className='confirm-user-removal-no-btn' 
                            onClick={handleCloseModal}
                        >
                            No
                        </Button>
                    </div>
                }
            case 2: 
                return {
                    topContent: <>
                        <IconButton className='confirm-demote-admin-modal-close-btn' onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                        <h2 className='confirm-demote-admin-header'>Please confirm</h2>
                    </>,
                    centerContent: <p className='confirm-demote-admin-paragraph'>Are you sure you want to revoke {selectedUser.first_name}'s administrator privileges?</p>,
                    bottomContent: <div className='confirm-demote-admin-button-suite'>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            className='confirm-demote-admin-yes-btn' 
                            onClick={handleConfirmDemoteAdmin}
                        >
                            Yes
                        </Button>
                        <Button 
                            variant='outlined' 
                            color='error' 
                            className='confirm-demote-admin-no-btn' 
                            onClick={handleCloseModal}
                        >
                            No
                        </Button>
                    </div>
                }
            default: 
                return {
                    topContent: <></>,
                    centerContent: <></>,
                    bottomContent: <></>
                }
        }
    }
   
    const actions = showActions 
        ? [
            { label: <><RemoveCircleOutlineIcon sx={{ marginRight: 5 }} />Remove User</>, onClick: handleRemoveUser },
            { label: <><PersonRemoveIcon sx={{ marginRight: 5 }} />Demote Admin</>, onClick: handleDemoteAdmin },
        ]
        : [];

    useEffect(() => {
        refreshUserTable();
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
        <>
            <DataTable 
                className='sheebay-users-table'
                actions={actions}
                columns={columns}
                data={data}
                title="All Users"
                maxHeight="150px"
                width="100%"
            />
            {modalState !== 0 && 
                <Modal
                    {...determineModalContent()}
                />
            }
        </>
    )
}