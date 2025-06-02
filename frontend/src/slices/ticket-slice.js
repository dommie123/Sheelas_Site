import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

import { determineBackendURL } from "../AppConfig";
import { authPostRequest } from "../utils/axios-helpers";

const initialState = {
    error: false
}

export const postGuestSupportTicket = createAsyncThunk(
    "tickets/post-guest",
    async (data, thunkApi) => {
        try {
            const res = await axios.post(`${determineBackendURL()}/guest_ticket`, data);
            
            return res.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const postSupportTicket = createAsyncThunk(
    "tickets/post",
    async (data, thunkApi) => {
        try {
            const res = await authPostRequest("tickets", data.ticketData, data.accessToken);
            return res.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

const ticketSlice = createSlice({
    name: "tickets",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(postGuestSupportTicket.fulfilled, (state) => {
            return {
                ...state,
                error: false
            }
        });
        builder.addCase(postGuestSupportTicket.rejected, (state, action) => {
            return {
                ...state,
                error: action.payload.response.data.message
            }
        });
        builder.addCase(postSupportTicket.fulfilled, (state) => {
            return {
                ...state,
                error: false
            }
        });
        builder.addCase(postSupportTicket.rejected, (state, action) => {
            return {
                ...state,
                error: action.payload.response.data.message
            }
        });
    }
});

export default ticketSlice.reducer;