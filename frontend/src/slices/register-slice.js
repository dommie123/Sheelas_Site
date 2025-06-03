import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { determineBackendURL } from "../AppConfig";
import { alertUser } from "../utils/alert-helpers";
import { showError } from "../utils/error";

export const retrieveVerificationCode = createAsyncThunk(
    'register/verify',
    async (email, thunkAPI) => {
        try {
            const response = await axios.post(`${determineBackendURL()}/verify`, email, { headers: { "Content-Type": "application/json" } });
            return response.data;
        } catch(e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const registerUser = createAsyncThunk(
    "register/user",
    async (user, thunkAPI) => {
        try {
            const response = await axios.post(`${determineBackendURL()}/register`, user);
            return response.data;
        } catch(e) {
            thunkAPI.rejectWithValue(e);
        }
    }
)

const initialState = {
    step: 1, 
    emailValid: true,
    phoneValid: true,
    passwordValid: true,
    confirmationCode: "",
    regUser: {}
}

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        incrementStep: (state) => {
            return {
                ...state, 
                step: state.step + 1
            }
        },
        decrementStep: (state) => {
            return {
                ...state, 
                step: state.step - 1
            }
        },
        resetStepCounter: (state) => {
            return {
                ...state,
                step: 1
            }
        },
        validateEmail: (state, action) => {
            const re = new RegExp("^[\\w\\-\\.]+@([\\w\\-]+\.)+[\\w\\-]{2,4}$");
            return {
                ...state, 
                emailValid: re.test(action.payload)
            }
        },
        validatePhone: (state, action) => {
            const re = new RegExp("\\(?[0-9]{3}\\)?.?[0-9]{3}.?[0-9]{4}");
            return {
                ...state,
                phoneValid: re.test(action.payload)
            }
        },
        validatePassword: (state, action) => {
            const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
            return {
                ...state,
                passwordValid: re.test(action.payload)
            }
        },
        resetVerificationCode: (state) => {
            return {
                ...state,
                confirmationCode: ''
            }
        },
        setRegUser: (state, action) => {
            return {
                ...state,
                regUser: action.payload
            }
        },
        clearRegUser: (state) => {
            return {
                ...state,
                regUser: initialState.regUser
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(retrieveVerificationCode.fulfilled, (state, action) => {
            return {
                ...state,
                confirmationCode: action.payload.code
            }
        });

        builder.addCase(retrieveVerificationCode.rejected, (state) => {
            showError("An error occurred while retrieving the verification code! Please refer to the network tab for details!");
            return state;
        });

        builder.addCase(registerUser.fulfilled, (state) => {
            alertUser("User created successfully!");
            return state;
        });

        builder.addCase(registerUser.rejected, (state) => {
            showError("An error occurred while registering this user! Please refer to the network tab for details!");
            return state;
        });

    }
})

export const { 
    incrementStep, 
    decrementStep, 
    resetStepCounter, 
    validateEmail, 
    validatePhone, 
    validatePassword,
    resetVerificationCode,
    setRegUser,
    clearRegUser
} = registerSlice.actions;

export default registerSlice.reducer;