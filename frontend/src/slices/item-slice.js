import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { showError } from "../utils/error";
import { determineBackendURL } from "../AppConfig";

export const getItems = createAsyncThunk(
    'items/get', 
    async (_, thunkApi) => {
        try {
            const url = determineBackendURL();
            const items = await axios.get(`${url}/items`)

            return items.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

const itemSlice = createSlice({
    name: 'items',
    initialState: {
        items: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getItems.fulfilled, (state, action) => {
            return {
                ...state,
                items: action.payload.items
            }
        });
        builder.addCase(getItems.rejected, (state) => {
            showError('An error occurred while fetching the items!');
            return {
                ...state,
                items: []
            }
        })
    }
});

export default itemSlice.reducer;