import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitApplication = createAsyncThunk(
    "admin/submit-app",
    async (data, thunkApi) => {
        // TODO submit an application to the backend
    }
)

const initialState = {
    acceptedTOS: false,
    error: false
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(submitApplication.rejected, (state) => {
            return {
                ...state,
                error: true
            }
        })
    }
});

export const { toggleAcceptTOS } = adminSlice.actions;
export default adminSlice.reducer;
