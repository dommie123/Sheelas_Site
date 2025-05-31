import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

import { authPutRequest } from '../utils/axios-helpers';
import { determineBackendURL } from "../AppConfig";

export const getSellers = createAsyncThunk(
    "seller/get-all",
    async (_, thunkApi) => {
        try {
            const sellers = await axios.get(`${determineBackendURL()}/users`);

            return sellers.data;
        } catch (err) {
            return thunkApi.rejectWithValue(err);
        }

    }
)

export const registerNewSeller = createAsyncThunk(
    "seller/register",
    async ({username, userData, userToken}, thunkApi) => {
        try {
            const response = await authPutRequest(`user/${username}`, userData, userToken)

            return {...response.data, accessToken: userToken};
        } catch (err) {
            return thunkApi.rejectWithValue(err);
        }
    }
)

const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        error: false,
        sellers: [],
    },
    extraReducers: (builder) => {
        builder.addCase(getSellers.fulfilled, (state, action) => {
            return {
                ...state,
                sellers: action.payload.sellers,
                error: false
            }
        });
        builder.addCase(getSellers.rejected, (state) => {
            return {
                ...state,
                sellers: [],
                error: true
            }
        });
        builder.addCase(registerNewSeller.fulfilled, (state, action) => {
            const newUserData = action.payload;
            localStorage.setItem("user", JSON.stringify(newUserData));

            return {
                ...state,
                error: false
            }
        });
        builder.addCase(registerNewSeller.rejected, (state) => {
            return {
                ...state,
                error: true
            }
        });
    }
})

export default sellerSlice.reducer;