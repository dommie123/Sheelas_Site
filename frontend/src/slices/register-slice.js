import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { determineBackendURL } from "../AppConfig";
import { addToMessageQueue } from "./global-slice";
import { showError } from "../utils/error";

import store from "../lib/store";

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

const registerSlice = createSlice({
    name: "register",
    initialState: {
        step: 1, 
        emailValid: true,
        phoneValid: true,
        passwordValid: true,
        confirmationCode: "",
    },
    reducers: {
        incrementStep: (state) => {
            state.step++;
        },
        resetStepCounter: (state) => {
            state.step = 1;
        },
        validateEmail: (state, action) => {
            const re = new RegExp("^[\\w\\-\\.]+@([\\w\\-]+\.)+[\\w\\-]{2,4}$");
            state.emailValid = re.test(action.payload);
        },
        validatePhone: (state, action) => {
            const re = new RegExp("\\(?[0-9]{3}\\)?.?[0-9]{3}.?[0-9]{4}");
            state.phoneValid = re.test(action.payload);
        },
        validatePassword: (state, action) => {
            state.passwordValid = true; // TODO have better password validation checks
        },
        resetVerificationCode: (state) => {
            state.confirmationCode = "";
        }
    },
    extraReducers: (builder) => {
        // const dispatch = store.dispatch;

        builder.addCase(retrieveVerificationCode.fulfilled, (state, action) => {
            state.confirmationCode = action.payload.code
        })

        builder.addCase(retrieveVerificationCode.rejected, (state, action) => {
            showError("An error occurred while retrieving the verification code! Please refer to the network tab for details!");
        })

        builder.addCase(registerUser.fulfilled, (state, action) => {
            // dispatch(addToMessageQueue({ severity: "success", message: "User created successfully!" }));
            alert("User created successfully!")
        })

        builder.addCase(registerUser.rejected, (state, action) => {
            showError("An error occurred while registering this user! Please refer to the network tab for details!");
        })

    }
})

export const { incrementStep, resetStepCounter, validateEmail, validatePhone, validatePassword, resetVerificationCode } = registerSlice.actions;
export default registerSlice.reducer;