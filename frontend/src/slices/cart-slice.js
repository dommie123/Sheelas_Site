import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authPostRequest } from '../utils/axios-helpers';

export const checkoutItems = createAsyncThunk(
    "cart/checkout",
    async (data, thunkApi) => {
        try {
            const response = await authPostRequest("/checkout", data.items, data.accessToken);

            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue(e);
        }
    }
)

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        addItem: (state, action) => {
            const newItems = [
                ...state.items,
                action.payload
            ];

            return {
                ...state, 
                items: newItems
            }
        },
        removeItem: (state, action) => {
            const newItems = state.items.filter(item => item.id !== action.payload.itemId);

            return {
                ...state,
                items: newItems
            }
        },
        clearItems: (state) => {
            return {
                ...state,
                items: []
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkoutItems.fulfilled, (state) => {
            return {
                ...state,
                items: []
            }
        });
        builder.addCase(checkoutItems.rejected, (state) => {
            return {
                ...state,
                items: []
            }
        });
    }
});

export const { addItem, removeItem, clearItems } = cartSlice.actions;
export default cartSlice.reducer;