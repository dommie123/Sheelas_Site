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
)

const initialState = {
    acceptedTOS: false,
    error: false,
    allUsers: []
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
    }
});

export const { toggleAcceptTOS } = adminSlice.actions;
export default adminSlice.reducer;
