import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

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
        })
    }
})

export default sellerSlice.reducer;