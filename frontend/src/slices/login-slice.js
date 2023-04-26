import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { determineBackendURL } from "../AppConfig";

export const logInUser = createAsyncThunk(
    "login/auth",
    async (data, thunkApi) => {
        try {
            const url = determineBackendURL();
            const userData = await axios.get(`${url}/user/${data.username}`);
            const accessToken = await axios.get(`${url}/auth`);

            const user = {...userData.data, accessToken};
            return user;
        } catch (e) {
            thunkApi.rejectWithValue(e);
        }
    }
);

const loginSlice = createSlice({
    name: "login",
    initialState: {
        loggedInUser: {},
    },
    extraReducers: (builder) => {
        builder.addCase(logInUser.fulfilled, (state, action) => {
            return {
                ...state, 
                loggedInUser: action.payload
            }
        })
    }
})

export default loginSlice.reducer;