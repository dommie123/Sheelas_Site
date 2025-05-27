import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authPostRequest } from '../utils/axios-helpers';
import { determineBackendURL } from '../AppConfig';

export const submitApplication = createAsyncThunk(
    "admin/submit-app",
    async ({data, accessToken}, thunkApi) => {
        try {
            const res = await authPostRequest('/admin_app', {
                status: "Submitted",
                message: JSON.stringify(data)
            }, accessToken);
            return res.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const getTotalSiteVisits = createAsyncThunk(
    'admin/visits',
    async (_, thunkApi) => {
        try {
            const url = determineBackendURL();
            const res = await axios.get(`${url}/visits`);

            return res.data.visits;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "admin/all-users",
    async (_, thunkApi) => {
        try {
            const url = determineBackendURL();
            const res = await axios.get(`${url}/users`);

            return res.data.users;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const getSupportTickets = createAsyncThunk(
    'admin/tickets',
    async (_, thunkApi) => {
        try {
            const url = determineBackendURL();
            const res = await axios.get(`${url}/tickets`);

            return res.data.tickets;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

export const getGuestSupportTickets = createAsyncThunk(
    'admin/guest-tickets',
    async (_, thunkApi) => {
        try {
            const url = determineBackendURL();
            const res = await axios.get(`${url}/tickets`);

            return res.data.tickets;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
);

const initialState = {
    acceptedTOS: false,
    error: false,
    totalVisits: undefined,
    allUsers: [],
    supportTickets: [],
    guestTickets: []
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        toggleAcceptTOS: (state, action) => {
            return {
                ...state,
                acceptedTOS: action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(submitApplication.fulfilled, (state) => {
            return {
                ...state,
                error: false
            }
        });
        builder.addCase(submitApplication.rejected, (state) => {
            return {
                ...state,
                error: true
            }
        });
        builder.addCase(getTotalSiteVisits.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                totalVisits: action.payload
            }
        });
        builder.addCase(getTotalSiteVisits.rejected, (state) => {
            return {
                ...state,
                error: true,
                totalVisits: null
            }
        });
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                allUsers: action.payload
            }
        });
        builder.addCase(getAllUsers.rejected, (state) => {
            return {
                ...state,
                error: true
            }
        });
        builder.addCase(getSupportTickets.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                supportTickets: action.payload
            }
        });
        builder.addCase(getSupportTickets.rejected, (state) => {
            return {
                ...state,
                error: true
            }
        });
        builder.addCase(getGuestSupportTickets.fulfilled, (state, action) => {
            return {
                ...state,
                error: false,
                guestTickets: action.payload
            }
        });
        builder.addCase(getGuestSupportTickets.rejected, (state) => {
            return {
                ...state,
                error: true
            }
        });
    }
});

export const { toggleAcceptTOS } = adminSlice.actions;
export default adminSlice.reducer;
