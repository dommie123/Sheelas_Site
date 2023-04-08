import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { determineBackendURL } from "../AppConfig";

const registerSlice = createSlice({
    name: "register",
    initialState: {
        step: 1, 
        emailValid: false,
        phoneValid: false,
        passwordValid: false,
        confirmationCode: "",
    },
    reducers: {
        incrementStep: (state) => {
            state.step++,
        },
        resetStepCounter: (state) => {
            state.step = 1,
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
        registerUser: (state, action) => {
            axios.post(`${determineBackendURL()}/register`, JSON.stringify({
                "first_name": action.payload.firstName,
                "last_name": action.payload.lastName,
                "email": action.payload.email,
                "phone": action.payload.phone,
                "username": action.payload.username,
                "password": action.payload.password,
            })).then(() => {
                console.log("User created successfully!");      // TODO replace with snackbar system
            }).catch(err => {
                console.error(`An error occurred while registering this user! Error: ${err.message}`)   // TODO replace with snackbar system.
            })
        },
        retrieveVerificationCode: (state, action) => {
            
        },
        resetVerificationCode: (state) => {
            state.confirmationCode = "";
        }
    }
})

export const { incrementStep, resetStepCounter, validateEmail, validatePhone, validatePassword, registerUser, retrieveVerificationCode } = registerSlice.actions;
export default registerSlice.reducer;