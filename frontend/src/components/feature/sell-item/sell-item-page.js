import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TextField, InputAdornment, Button } from '@mui/material';

import { sellItem } from '../../../slices/item-slice';
import { showError } from '../../../utils/error';

import './sell-item-page.css';

export default function SellItemPage() {
    const [load, setLoad] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(0);
    const user = useSelector(state => state.login.loggedInUser);
    const itemError = useSelector(state => state.items.error);

    const dispatch = useDispatch();

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

        dispatch(sellItem({itemName: productName, item, user}));
    }

    useEffect(() => {
        if (!load) {
            setLoad(true);
            return;
        }
        verifyUserInput();
    }, [productName, productPrice, productQuantity]);

    useEffect(() => {
        if (itemError.message) {
            showError(itemError.message);
        }
    }, [itemError])

    return (
        <div className='sell-item-page-container'>
            <h2 className='sell-item-header'>Sell your product here!</h2>
            <TextField
                className='sell-item-name' 
                variant='outlined' 
                label='Name of Product' 
                value={productName}
                onChange={(e) => {
                    setProductName(e.currentTarget.value);
                }}
                error={nameError}
                helperText={nameError ? "Please enter a product name!" : undefined}
                // sx={textFieldSx}
            />
            <TextField
                className='sell-item-description' 
                variant='outlined' 
                label='Product Description' 
                value={productDescription}
                onChange={(e) => setProductDescription(e.currentTarget.value)}
                multiline
                // sx={textFieldSx}
            />
            <TextField
                className='sell-item-price'
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
                // sx={textFieldSx}
            />
            <TextField
                className='sell-item-quantity' 
                variant='outlined' 
                label='Quantity' 
                value={productQuantity}
                onChange={(e) => {
                    setProductQuantity(e.currentTarget.value);
                }}
                error={quantityError}
                helperText={quantityError ? "Quantity must be a whole number!" : undefined}
                // sx={textFieldSx}
            />
            <Button className='sell-item-submit-button' onClick={handleSubmit} color='primary' variant='contained'>Submit</Button>
        </div>
    )
}