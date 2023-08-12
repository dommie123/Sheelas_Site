import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { determineBackendURL } from "../AppConfig";
import { showError } from "../utils/error";

export const logInUser = createAsyncThunk(
    "login/auth",
    async (data, thunkApi) => {
        try {
            const url = determineBackendURL();
            const userData = await axios.get(`${url}/user/${data.username}`);
            const accessToken = await axios.post(`${url}/auth`, { username: data.username, password: data.password });

            const user = {...userData.data, accessToken: accessToken.data};
            return user;
        } catch (e) {
            thunkApi.rejectWithValue(e);
        }
    }
);

export const verifyUserExists = createAsyncThunk(
    "login/verify",
    async (data, thunkApi) => {
        try {
            const url = determineBackendURL();
            const userData = await axios.get(`${url}/user/${data.username}`); 
            return userData.data
        } catch (e) {
            thunkApi.rejectWithValue(e);
        }
    }
)

export const changePassword = createAsyncThunk(
    "login/changePassword",
    async (data, thunkApi) => {
        try {
            const url = determineBackendURL();
            const modifiedUserData = await axios.put(`${url}/user/${data.username}`, {password: data.password});

            return modifiedUserData.data;
        } catch (e) {
            thunkApi.rejectWithValue(e);
        }
    }
)

const loginSlice = createSlice({
    name: "login",
    initialState: {
        error: false,
        loggedInUser: {},
        forgotPasswordStep: 1,
        userExists: false,
    },
    reducers: {
        logOutUser: (state) => {
            return {
                ...state,
                loggedInUser: {}
            }
        },
        incrementStep: (state) => {
            return {
                ...state, 
                forgotPasswordStep: state.forgotPasswordStep + 1,
            }
        },
        decrementStep: (state) => {
            return {
                ...state, 
                forgotPasswordStep: state.forgotPasswordStep - 1,
            }
        }, 
        resetStepCounter: (state) => {
            return {
                ...state,
                forgotPasswordStep: 1
            }
        },
        resetErrorMessage: (state) => {
            return {
                ...state,
                error: false
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logInUser.fulfilled, (state, action) => {
            if (!action.payload) {
                return {
                    ...state, 
                    error: "Incorrect username or password. Please try again.",
                }
            }
            return {
                ...state, 
                loggedInUser: action.payload
            }
        })
        builder.addCase(logInUser.rejected, (state, action) => {
            showError(action.payload);
        })
        builder.addCase(changePassword.fulfilled, (state, action) => {
            if (!action.payload) {
                return {
                    ...state, 
                    error: "Incorrect username or password. Please try again.",
                }
            }
            return {
                ...state, 
                loggedInUser: action.payload
            }
        })
        builder.addCase(changePassword.rejected, (state, action) => {
            showError(action.payload);
        })
        builder.addCase(verifyUserExists.fulfilled, (state, action) => {
            return {
                ...state, 
                userExists: Boolean(action.payload),
                loggedInUser: action.payload
            }
        })
        builder.addCase(verifyUserExists.rejected, (state) => {
            return {
                ...state, 
                userExists: false,
            }
        })
    }
})

export const { logOutUser, incrementStep, decrementStep, resetStepCounter, resetErrorMessage } = loginSlice.actions;
export default loginSlice.reducer;