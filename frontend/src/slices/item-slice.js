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

export const sellItem = createAsyncThunk(
    'items/sell',
    async (data, thunkApi) => {
        try {
            const url = determineBackendURL();
            const accessToken = `jwt ${data.user.accessToken.access_token}`;
            const res = await axios.post(
                `${url}/item/${data.itemName}`,
                data.item,
                { 
                    headers: {
                        "Authorization": accessToken
                    }
                }
            );

            return res.data;

        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

const itemSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        selectedItem: {},
        error: {}
    },
    reducers: {
        setSelectedItem: (state, action) => {
            return {
                ...state, 
                selectedItem: action.payload
            }
        },
        clearSelectedItem: (state) => {
            return {
                ...state,
                selectedItem: {}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getItems.fulfilled, (state, action) => {
            return {
                ...state,
                items: action.payload.items,
                error: {}
            }
        });
        builder.addCase(getItems.rejected, (state, action) => {
            return {
                ...state,
                items: [],
                error: action.error
            }
        });
        builder.addCase(sellItem.fulfilled, (state) => {
            window.location.href = '/home';
            return {
                ...state,
                error: {}
            };
        });
        builder.addCase(sellItem.rejected, (state, action) => {
            return {
                ...state,
                error: action.error
            };
        });
    }
});

export const { setSelectedItem, clearSelectedItem } = itemSlice.actions;
export default itemSlice.reducer;