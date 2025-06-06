import { configureStore } from '@reduxjs/toolkit';

import registerReducer from '../slices/register-slice';
import loginReducer from "../slices/login-slice";
import globalSlice from '../slices/global-slice';
import itemSlice from '../slices/item-slice';
import cartSlice from '../slices/cart-slice';
import sellerSlice from '../slices/seller-slice';
import adminSlice from '../slices/admin-slice';
import ticketSlice from '../slices/ticket-slice';

export default configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer,
        global: globalSlice,
        items: itemSlice,
        cart: cartSlice,
        seller: sellerSlice,
        admin: adminSlice,
        ticket: ticketSlice
    },
})