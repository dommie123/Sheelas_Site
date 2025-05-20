import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import { Typography, IconButton, Button } from '@mui/material';

import { Modal } from '../modal/modal';

import { clearAlertMessage, clearErrorMessage, getItems, removeItem, setSelectedItem } from '../../../slices/item-slice';
import { alertUser } from '../../../utils/alert-helpers';
import { showError } from '../../../utils/error';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';

import './item-card.css';

export default function ItemCard(props) {
    const {
        itemId, 
        seller_id, 
        name, 
        description, 
        price, 
        quantity,
        productImageUrl, 
        isOnThankYouPage
    } = props;

    const imageUrl = productImageUrl ? productImageUrl : `https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg`;
    const loggedInUser = useSelector(state => state.login.loggedInUser);
    const alertMessage = useSelector(state => state.items.alertMessage);
    const errorMessage = useSelector(state => state.items.error);
    const [removeItemModalActive, setRemoveItemModalActive] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const canRemoveItem = Boolean(loggedInUser.role === 1 || (loggedInUser.role === 3 && seller_id === loggedInUser.id));

    const handleLinkClick = (event) => {
        event.preventDefault();

        dispatch(setSelectedItem({ ...props, seller_id, id: itemId, itemId }));

        navigate('/buy');
    }
    
    const handleRemoveItem = () => {
        dispatch(removeItem({ itemName: name, accessToken: loggedInUser.accessToken }));
        dispatch(getItems());
        handleCloseModal();
    }

    const handleOpenModal = () => {
        setRemoveItemModalActive(true);
    }

    const handleCloseModal = () => {
        setRemoveItemModalActive(false);
    }

    useEffect(() => {
        if (alertMessage !== "") {
            alertUser(alertMessage);
            dispatch(clearAlertMessage());
        } else if (errorMessage.message) {
            showError(errorMessage.message);
            dispatch(clearErrorMessage());
        }
        // eslint-disable-next-line
    }, [alertMessage, errorMessage]);

    return  (
        <Card className='item-card-container' role='listitem'>
            <a onClick={handleLinkClick} href='/buy' className='select-item-link'><img className='item-image' src={imageUrl} alt={`${name} Product`} /></a>
            <div className='item-text-content-wrapper'>
                <a onClick={handleLinkClick} aria-label={`${name} Item Link ${name} Item Name`} href='/buy' className='select-item-link'><Typography variant='h5' component='h3' className='item-title'>{name}</Typography></a>
                <a onClick={handleLinkClick} aria-label={`${name} Item Link ${name} Item Description ${description}`} href='/buy' className='select-item-link'><Typography variant='p' component='p' className='item-decsription'>{description}</Typography></a>
                <a onClick={handleLinkClick} aria-label={`${name} Item Link ${name} Item Price ${price}`} href='/buy' className='select-item-link'><Typography variant='p' component='p' className='item-price'>{price}</Typography></a>
                {((quantity < 10 && quantity > 0) && !isOnThankYouPage) && (<Typography variant='p' component='p' aria-label={`${name} Item Quantity Low`} className='item-low-quantity-messsage'>Only {quantity} left! Order now!</Typography>)}
            </div>
            {(canRemoveItem && !isOnThankYouPage) && 
            <IconButton className='item-card-remove-item-btn' color='error' onClick={handleOpenModal}><DeleteForeverIcon /></IconButton>
            }
            {removeItemModalActive && 
            <Modal 
                topContent={
                    <>
                        <IconButton className='confirm-item-removal-modal-close-btn' onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                        <h2 className='confirm-item-removal-header'>Please confirm</h2>
                    </>
                }
                centerContent={
                    <p className='confirm-item-removal-paragraph'>Are you sure you want to remove the item, {name}, from the database?</p>
                }
                bottomContent={
                    <div className='confirm-item-removal-button-suite'>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            className='confirm-item-removal-yes-btn' 
                            onClick={handleRemoveItem}
                        >
                            Yes
                        </Button>
                        <Button 
                            variant='outlined' 
                            color='error' 
                            className='confirm-item-removal-no-btn' 
                            onClick={handleCloseModal}
                        >
                            No
                        </Button>
                    </div>
                }
            />
            }
        </Card>
    )
    
}