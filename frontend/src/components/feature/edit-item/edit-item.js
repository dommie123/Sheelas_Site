import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { TextField, InputAdornment, Button } from '@mui/material';

import { showError } from '../../../utils/error';
import { updateItem } from '../../../slices/item-slice';

import './edit-item.css';

const EditItemPage = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productQuantity, setProductQuantity] = useState(0);
    const [productPrice, setProductPrice] = useState(0);
    const user = useSelector(state => state.login.loggedInUser);
    const itemError = useSelector(state => state.items.error);

    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    // Error handler variables
    const [nameError, setNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);

    const verifyUserInput = () => {
        setNameError(productName === '');
        setPriceError(isNaN(parseFloat(productPrice)));
        setQuantityError(isNaN(parseInt(productQuantity)));
    }
    
    const handleSubmit = () => {
        if (!user.id) {
            showError('User not recognized! Please log in again!');
            return;
        }

        verifyUserInput();

        if (nameError || priceError || quantityError) {
            return;
        }

        const item = { 
            description: productDescription, 
            price: productPrice,
            quantity: productQuantity,
            seller_id: user.id
        }

        dispatch(updateItem({ itemName: productName, item, user }));
    };

    useEffect(() => {
        if (user.role === 2) {
            navigate('/error');
            return;
        }

        if (itemError.message) {
            showError(itemError.message);
        }
        // eslint-disable-next-line
    }, [itemError, user]);

    return (
        <div className='edit-item-page-container'>
            <h2 className='edit-item-header' aria-label='Edit Product Information'>Update your product's information here!</h2>
            <TextField
                className='edit-item-name' 
                aria-label='Product Name'
                variant='outlined' 
                label='Name of Product' 
                value={productName}
                onChange={(e) => {
                    setProductName(e.currentTarget.value);
                }}
                error={nameError}
                helperText={nameError ? "Please enter a product name!" : undefined}
            />
            <TextField
                className='edit-item-description' 
                aria-label='Product Description'
                variant='outlined' 
                label='Product Description' 
                value={productDescription}
                onChange={(e) => setProductDescription(e.currentTarget.value)}
                multiline
            />
            <TextField
                className='edit-item-price'
                aria-label='Product Price'
                variant='outlined'
                label="Price"
                value={productPrice}
                onChange={(e) => {
                    setProductPrice(e.currentTarget.value);
                }}
                InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
                error={priceError}
                helperText={priceError ? "Price must be a decimal number (i.e. '3.25')!" : undefined}
            />
            <TextField
                className='edit-item-quantity' 
                aria-label='Product Quantity'
                variant='outlined' 
                label='Quantity' 
                value={productQuantity}
                onChange={(e) => {
                    setProductQuantity(e.currentTarget.value);
                }}
                error={quantityError}
                helperText={quantityError ? "Quantity must be a whole number!" : undefined}
            />
            <Button className='edit-item-submit-button' aria-label="Update Product" onClick={handleSubmit} color='primary' variant='contained'>Save Changes</Button>
        </div>
    );
};

export default EditItemPage;