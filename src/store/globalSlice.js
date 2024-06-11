import { createSlice } from '@reduxjs/toolkit';

export const global = createSlice({
    name: 'global',
    initialState: {
        snackbar: {
            visible: false,
            title: ''
        },
    },
    reducers: {
        setSnackbar: (state, action) => {
            state.snackbar = action.payload;
        },
    },
});

export const { setSnackbar } = global.actions;
export default global.reducer;
