import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        message: null
    },
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        clearMessage: (state, action) => {
            state.message = null;
        }
    }
});

export const { setMessage, clearMessage } = notificationSlice.actions;

export default notificationSlice.reducer;