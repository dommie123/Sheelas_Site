import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

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

import { setUserCheckedOut } from '../../../../slices/login-slice';
import { checkoutItems } from '../../../../slices/cart-slice';
import { toCurrencyFormat, fromCurrencyFormat } from '../../../../utils/strings';

import { primaryButtonExtraStyles } from '../../../../styles/global-styles';
import "./shopping-cart.css";

export default function ShoppingCartDrawer(props) {
    const { className } = props;
    const [open, setOpen] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const items = useSelector(state => state.cart.items);
    const user = useSelector(state => state.login.loggedInUser);
    const isMobile = useSelector(state => state.global.isMobile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setOpen(false);
        dispatch(checkoutItems({ items, user: user, accessToken: user.accessToken }));
        dispatch(setUserCheckedOut(true));
        navigate('/thank-you')
    }

    const calculateTotal = () => {
        let newTotal = 0;

        items.forEach(item => {
            newTotal += fromCurrencyFormat(item.price) * item.quantity;
        });

        setCartTotal(newTotal);
    }

    const list = useCallback(() => { 
        return items.length > 0 ? (
            <Box
                className={`${className}-list-container`}
                sx={{ width: isMobile ? "90%" : 400 }}
                role="presentation"
            >
                <List role="list" aria-label='Cart Items'>
                    {items.map((item) => (
                        <SmallItemCard itemId={item.id} name={item.name} price={item.price} quantity={item.quantity} />
                    ))}
                </List>
            </Box>
        ) : (<p className='cart-is-empty-text' aria-label='Cart is empty'>Your cart is empty! Why not fill it up with some awesome stuff?</p>)
        // eslint-disable-next-line
    }, [items]);

    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line
    }, [items]);

    return (
        <div className={className}>
            <IconButton className={`${className}-button`} aria-label='Shopping Cart' onClick={() => { setOpen(true) }}><ShoppingCartIcon /></IconButton>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => { setOpen(false) }}
                className={`${className}-drawer`}
            >
                <Typography variant='h5' component='h5' className='shopping-cart-header' role='heading' aria-label="Your Cart">Your Cart</Typography>
                <Divider className='cart-header-separator' aria-hidden="true" sx={{
                    marginBottom: "10px",
                    marginTop: "10px",
                    marginLeft: "15px",
                    marginRight: "15px",
                }}/>
                {list()}
                <Button 
                    sx={{ ...primaryButtonExtraStyles, marginTop: "auto" }} 
                    variant='contained' 
                    className='checkout-btn' 
                    disabled={items.length === 0} 
                    onClick={handleCheckout}
                    aria-label='Proceed to Checkout'
                >
                    {`Checkout (${toCurrencyFormat(cartTotal)})`}
                </Button>
            </Drawer>
        </div>
    );
}