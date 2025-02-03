import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TextField, InputAdornment, Button } from '@mui/material';

import { IMAGE_EXTENSIONS } from '../../../lib/constants';

import { ImageSelector } from './image-selector/image-selector';

import { sellItem } from '../../../slices/item-slice';
import { showError } from '../../../utils/error';
import { authPostRequestWithFile } from '../../../utils/axios-helpers';

import './sell-item-page.css';

export default function SellItemPage() {
    const [load, setLoad] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(0);
    const [localImgUrl, setLocalImgUrl] = useState("");         // C:\fakepath\imgname.ext
    const [imageUrl, setImageUrl] = useState("");               // The actual image URL to store to the backend
    const [imageFile, setImageFile] = useState(null);
    const user = useSelector(state => state.login.loggedInUser);
    const itemError = useSelector(state => state.items.error);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Error handler variables
    const [nameError, setNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const verifyUserInput = () => {
        setNameError(productName === '');
        setPriceError(isNaN(parseFloat(productPrice)));
        setQuantityError(isNaN(parseInt(productQuantity)));

        // Verify that the file submitted is an image
        // const urlParts = imageUrl.split(".");
        const extension = Boolean(imageFile) ? imageFile.type.split("/")[1] : "";

        if (extension === "") {
            setImageError(false);
        } else {
            setImageError(!IMAGE_EXTENSIONS.includes(extension));
        }
    }

    const itemHasErrors = () => {
        return nameError || priceError || quantityError || imageError;
    }

    const uploadImageAndGetUrl = async () => {
        const formData = new FormData();
        formData.append('file', imageFile);

        const newImage = await authPostRequestWithFile("/upload", formData, user.accessToken);
        return newImage.data.url;
    }

    const handleSubmit = () => {
        verifyUserInput();

        if (itemHasErrors()) {
            return;
        }
        
        // TODO convert item image URL to blob and send to backend 
        // const productImgUrl = uploadImageAndGetUrl();

        const item = { 
            description: productDescription, 
            price: productPrice,
            quantity: productQuantity,
            image_url: imageUrl,
            seller_id: user.id,
        }

        dispatch(sellItem({itemName: productName, item, user}));
    }

    const handleChangeImage = (e) => {
        setLocalImgUrl(e.currentTarget.value);
        setImageFile(e.target.files[0]);
    }

    useEffect(() => {
        if (!imageFile) {
            return;
        }

        verifyUserInput();

        if (itemHasErrors()) {
            return;
        }

        uploadImageAndGetUrl().then(res => {
            setImageUrl(res);
        })
        // eslint-disable-next-line
    }, [imageFile])

    useEffect(() => {
        if (user.role === 2) {
            navigate('/error')
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if (!load) {
            setLoad(true);
            return;
        }

        verifyUserInput();
      
        // eslint-disable-next-line
    }, [productName, productPrice, productQuantity, imageUrl]);

    useEffect(() => {
        if (itemError.message) {
            showError(itemError.message);
        }
    }, [itemError])

    return (
        <div className='sell-item-page-container'>
            <h2 className='sell-item-header' aria-label='Sell Product'>Sell your product here!</h2>
            <TextField
                className='sell-item-name' 
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
                className='sell-item-description' 
                aria-label='Product Description'
                variant='outlined' 
                label='Product Description' 
                value={productDescription}
                onChange={(e) => setProductDescription(e.currentTarget.value)}
                multiline
            />
            <TextField
                className='sell-item-price'
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
                className='sell-item-quantity' 
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
            <ImageSelector 
                label="Product Photos" 
                value={localImgUrl} 
                handleChange={handleChangeImage} 
                error={imageError}
                helperText={imageError ? "Your file must be an image (i.e. '.jpg', '.png', '.jpeg')" : undefined}
            />
            <Button 
                className='sell-item-submit-button' 
                aria-label="Submit Product" 
                onClick={handleSubmit} 
                color='primary' 
                variant='contained'
            >
                Submit
            </Button>
        </div>
    )
}