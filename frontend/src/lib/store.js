import {configureStore} from '@reduxjs/toolkit';

import registerReducer from '../slices/register-slice';
import loginReducer from "../slices/login-slice";

export default configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer,
    },
})