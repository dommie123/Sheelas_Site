import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { determineBackendURL } from "../AppConfig";

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

const loginSlice = createSlice({
    name: "login",
    initialState: {
        loggedInUser: {},
    },
    reducers: {
        logOutUser: (state) => {
            return {
                ...state,
                loggedInUser: {}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logInUser.fulfilled, (state, action) => {
            if (!action.payload) {
                alert("Incorrect username or password! Please try again!");
                return state;
            }
            return {
                ...state, 
                loggedInUser: action.payload
            }
        })
        builder.addCase(logInUser.rejected, (state, action) => {
            alert(action.payload);
        })
    }
})

export const { logOutUser } = loginSlice.actions;
export default loginSlice.reducer;