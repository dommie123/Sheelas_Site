import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: "global",
    initialState: {
        isMobile: false,
        messageQueue: []    // message = { severity: "error|warn|success|info", message: "<message>" }
    },
    reducers: {
        setMobile: (state, action) => {
            return {
                ...state,
                isMobile: action.payload
            }
        },
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

export const { addToMessageQueue, removeFromMessageQueue, setMobile } = globalSlice.actions;
export default globalSlice.reducer;