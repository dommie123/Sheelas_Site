import React, { useState } from 'react';

import {
    Drawer,
    Box,
    List,
    IconButton,
    Button,
    Typography,
    Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import SmallItemCard from '../../../common/item-card/small-item-card';

import { primaryButtonExtraStyles } from '../../../../styles/global-styles';
import "./shopping-cart.css";

export default function ShoppingCartDrawer(props) {
    const { className } = props;
    const [open, setOpen] = useState(false);
    const items = [ // TODO replace with actual cart items once implemented
        {
            id: 1,
            name: "Mint Candies",
            description: "This is a test desecription",
            price: "$0.99",
            quantity: 1,
            seller_id: 1
        },
        {
            id: 2,
            name: "My Hero Academia Stickers",
            description: "This is a test desecription",
            price: "$1.99",
            quantity: 1,
            seller_id: 1
        },
    ];

    const list = () => (
        <Box
            className={`${className}-list-container`}
            sx={{ width: 400 }}
            role="presentation"
            onClick={() => { setOpen(false) }}
            onKeyDown={() => { setOpen(false) }}
        >
            <List>
                {items.map((item) => (
                    <SmallItemCard name={item.name} price={item.price} quantity={item.quantity} />
                ))}
            </List>
        </Box>
    );

    return (
        <div className={className}>
            <IconButton className={`${className}-button`} onClick={() => { setOpen(true) }}><ShoppingCartIcon /></IconButton>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => { setOpen(false) }}
                className={`${className}-drawer`}
            >
                <Typography variant='h5' component='h5' className='shopping-cart-header'>Your Cart</Typography>
                <Divider className='cart-header-separator' />
                {list()}
                <Button sx={primaryButtonExtraStyles} variant='contained' className='checkout-btn' onClick={() => {}}>Checkout ($2.98)</Button>
            </Drawer>
        </div>
    );
}