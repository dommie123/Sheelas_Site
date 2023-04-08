import {configureStore} from '@reduxjs/toolkit';

import registerReducer from '../slices/register-slice'

export default configureStore({
    reducer: {
        register: registerReducer,
    },
})