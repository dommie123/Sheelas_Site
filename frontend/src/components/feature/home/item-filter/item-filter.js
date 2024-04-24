import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button, Typography, IconButton } from '@mui/material';
import Select from '../../../common/select/select';
import PriceSlider from './item-filter-price-slider';

import { getSellers } from '../../../../slices/seller-slice';
import { getItemsByFilters } from '../../../../slices/item-slice';
import { getItems } from '../../../../slices/item-slice';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import './item-filter.css';

export default function ItemFilter() {
    const [currentSeller, setSeller] = useState("");
    const [currentPrice, setPrice] = useState(-1)   // -1 means any price point
    const [sellerOptions, setSellerOptions] = useState([])
    const sellers = useSelector(state => state.seller.sellers);
    const user = useSelector(state => state.login.loggedInUser);
    const isMobile = useSelector(state => state.global.isMobile);
    const dispatch = useDispatch();

    const getIDFromUsername = (username) => {
        for (let seller of sellers) {
            if (seller.username === username) {
                return seller.id;
            }
        }

        return -1;
    }

    const handleClearFilters = () => {
        dispatch(getItems());
        setPrice(-1);
        setSeller("");
    }

    const handleApplyFilters = () => {
        let filters = {};

        // Assign filter properties to filter object unless they are set to their default values.
        if (currentSeller !== "") {
            filters.seller_id = getIDFromUsername(currentSeller);
        }
        if (currentPrice !== -1) {
            filters.price = currentPrice;
        }

        // If the user has not applied any filters, simply get all items.
        if (Object.keys(filters).length === 0) {
            dispatch(getItems());
            return;
        }

        // Otherwise, get items based on applied filters.
        dispatch(getItemsByFilters({
            filters,
            accessToken: user.accessToken
        }))
    }   

    useEffect(() => {
        if (!sellers) {
            return;
        }

        if (sellers.length === 0) {
            return;
        }

        setSellerOptions(sellers.map(seller => seller.username));
    }, [sellers])

    useEffect(() => {
        console.log({ seller: currentSeller, price: currentPrice });
    }, [currentPrice, currentSeller])

    useEffect(() => {
        dispatch(getSellers());
    }, [])

    return (
        <div className='item-filter-container'>
            <Typography variant='h6' component='h6' className='item-filter-heading'>{isMobile ? "Filter" : "Filter Items By"}</Typography>
            <PriceSlider value={currentPrice} onChange={(e) => { setPrice(e.target.value) }} className="item-filter-price" />
            <div className='item-filter item-filter-seller'>
                <Select 
                    size="small"
                    value={currentSeller}
                    onChange={(e) => { setSeller(e.target.value) }}
                    label="Seller"
                    className="item-filter-seller-selector"
                    options={sellerOptions}
                />
            </div>
            <div className='item-filter-button-suite'>
                { isMobile 
                ? <>
                    <IconButton size='small' variant="contained" color='success' className='item-filter-apply-btn' onClick={handleApplyFilters}>
                        <CheckIcon />
                    </IconButton>
                    <IconButton size='small' variant="contained" color='error' className='item-filter-clear-btn' onClick={handleClearFilters}>
                        <ClearIcon />
                    </IconButton>
                </> 
                : <>
                    <Button size='small' variant="contained" color='success' className='item-filter-apply-btn' onClick={handleApplyFilters}>Apply Filters</Button>
                    <Button size='small' variant="contained" color='error' className='item-filter-clear-btn' onClick={handleClearFilters}>Clear Filters</Button>
                </>
                }

            </div>
        </div>
    )
}