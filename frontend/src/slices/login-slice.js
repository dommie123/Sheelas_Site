import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { determineBackendURL } from "../AppConfig";
import { authPutRequest } from "../utils/axios-helpers";

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
            return thunkApi.rejectWithValue(e);
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
            return thunkApi.rejectWithValue(e);
        }
    }
)

export const changePassword = createAsyncThunk(
    "login/changePassword",
    async (data, thunkApi) => {
        if (!data.password || data.password === "") {
            return thunkApi.rejectWithValue("Please enter a new password.");
        }

        try {
            const url = determineBackendURL();
            const modifiedUserData = await axios.put(`${url}/user/${data.username}`, {password: data.password});

            return modifiedUserData.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

export const changeUserSettings = createAsyncThunk(
    "login/changeUserSettings",
    async (data, thunkApi) => {
        try {
            const modifiedUserData = await authPutRequest(`user/${data.user.username}`, data.user, data.accessToken);

            return modifiedUserData.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

export const fetchUser = createAsyncThunk(
    "login/fetchUser",
    async (data, thunkApi) => {
        try {
            const url = determineBackendURL();
            const user = await axios.post(`${url}/soft_auth`, data);

            return user.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

const loginSlice = createSlice({
    name: "login",
    initialState: {
        checkedLocalSessionForUser: false,
        error: false,
        loggedInUser: {},
        forgotPasswordStep: 1,
        userExists: false,
        userHasCheckedOut: false,
        unverifiedUser: {}
    },
    reducers: {
        logOutUser: (state) => {
            // Clear logged in user from local session
            localStorage.setItem("user", "");

            return {
                ...state,
                loggedInUser: {},
                unverifiedUser: {},
                checkedLocalSessionForUser: false
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
        },
        setUserCheckedOut: (state, action) => {
            return {
                ...state,
                userHasCheckedOut: action.payload
            }
        },
        getUserFromSession: (state) => {
            const userSession = localStorage.getItem("user");

            if (!userSession || userSession === "") {
                console.warn("WARNING: No user was found in local session!");
                return {
                    ...state,
                    checkedLocalSessionForUser: true
                }
            }

            const user = JSON.parse(userSession);
            const accessToken = user.accessToken

            return {
                ...state,
                loggedInUser: { ...user, accessToken },
                checkedLocalSessionForUser: true
            }
        },
        clearUnverifiedUser: (state) => {
            return {
                ...state,
                unverifiedUser: {}
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
            } else {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }

            return {
                ...state, 
                loggedInUser: action.payload,
                error: false
            }
        });
        builder.addCase(logInUser.rejected, (state, action) => {
            return {
                ...state,
                loggedInUser: {},
                error: action.payload.response.data.message
            }
        });
        builder.addCase(changePassword.fulfilled, (state, action) => {
            if (!action.payload) {
                return {
                    ...state, 
                    error: "Incorrect username or password. Please try again.",
                }
            }
            return {
                ...state, 
                loggedInUser: action.payload,
                error: false
            }
        });
        builder.addCase(changePassword.rejected, (state, action) => {
            return {
                ...state,
                error: action.payload.message
            }        
        });
        builder.addCase(verifyUserExists.fulfilled, (state, action) => {
            if (!Boolean(action.payload)) {
                return {
                    ...state,
                    error: `That user doesn't exist in our database. Please try again.`
                };
            }

            return {
                ...state, 
                userExists: Boolean(action.payload),
                loggedInUser: action.payload,
                error: false
            }
        });
        builder.addCase(verifyUserExists.rejected, (state) => {
            return {
                ...state, 
                userExists: false,
                error: "That user doesn't exist in our database. Please try again."
            }
        });
        builder.addCase(changeUserSettings.fulfilled, (state, action) => {
            return {
                ...state,
                userExists: true,
                loggedInUser: action.payload,
                error: false
            }
        });
        builder.addCase(changeUserSettings.rejected, (state, action) => {
            return {
                ...state,
                userExists: false,
                error: action.payload.message
            }
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return {
                ...state,
                userExists: true,
                unverifiedUser: action.payload,
                error: false
            }
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            return {
                ...state,
                userExists: false,
                unverifiedUser: {},
                error: action.payload.response.data.message
            }
        });
    }
})

export const { 
    logOutUser, 
    incrementStep,
    decrementStep,
    resetStepCounter,
    resetErrorMessage,
    setUserCheckedOut,
    getUserFromSession,
    clearUnverifiedUser
} = loginSlice.actions;

export default loginSlice.reducer;