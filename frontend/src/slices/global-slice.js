import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: "global",
    initialState: {
        messageQueue: []    // message = { severity: "error|warn|success|info", message: "<message>" }
    },
    reducers: {
        addToMessageQueue: (state, action) => {
            return {
                ...state, 
                messageQueue: [
                    ...state.messageQueue,
                    action.payload
                ]
            }
        },
        removeFromMessageQueue: (state) => {
            state.messageQueue.shift();
        }
    }
});

export const { addToMessageQueue, removeFromMessageQueue } = globalSlice.actions;
export default globalSlice.reducer;