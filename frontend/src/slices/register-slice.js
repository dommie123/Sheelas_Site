import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { determineBackendURL } from "../AppConfig";

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
        // registerUser: (state, action) => {
        //     axios.post(`${determineBackendURL()}/register`, JSON.stringify({
        //         "first_name": action.payload.firstName,
        //         "last_name": action.payload.lastName,
        //         "email": action.payload.email,
        //         "phone": action.payload.phone,
        //         "username": action.payload.username,
        //         "password": action.payload.password,
        //     })).then(() => {
        //         console.log("User created successfully!");      // TODO replace with snackbar system
        //     }).catch(err => {
        //         console.error(`An error occurred while registering this user! Error: ${err.message}`)   // TODO replace with snackbar system.
        //     })
        // },
        // retrieveVerificationCode: (state, action) => {
        //     axios.post(`${determineBackendURL()}/verify`, JSON.stringify({
        //         "email": action.payload.email
        //     }), { headers: { "Content-Type": "application/json" } }).then(response => {
        //         console.log({code: response.data.code});
        //         state.confirmationCode = response.data.code;
        //     }).catch(err => {
        //         alert(`An error occurred while retrieving the verification code! Error: ${err.message}`);
        //     })
        // },
        resetVerificationCode: (state) => {
            state.confirmationCode = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(retrieveVerificationCode.fulfilled, (state, action) => {
            state.confirmationCode = action.payload.code
        })

        builder.addCase(retrieveVerificationCode.rejected, (state, action) => {
            alert("An error occurred while retrieving the verification code! Please refer to the network tab for details!");
        })

        builder.addCase(registerUser.fulfilled, (state, action) => {
            alert("User created successfully!");
        })

        builder.addCase(registerUser.rejected, (state, action) => {
            alert("An error occurred while registering this user! Please refer to the network tab for details!");
        })

    }
})

export const { incrementStep, resetStepCounter, validateEmail, validatePhone, validatePassword, resetVerificationCode } = registerSlice.actions;
export default registerSlice.reducer;