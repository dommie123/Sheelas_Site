import {configureStore} from '@reduxjs/toolkit';

import registerReducer from '../slices/register-slice';
import loginReducer from "../slices/login-slice";
import globalSlice from '../slices/global-slice';
import itemSlice from '../slices/item-slice';

export default configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer,
        global: globalSlice,
        items: itemSlice
    },
})