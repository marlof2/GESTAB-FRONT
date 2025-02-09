import { createSlice } from '@reduxjs/toolkit';

export const global = createSlice({
    name: 'global',
    initialState: {
        snackbar: {
            visible: false,
            title: ''
        },
        auth: {
            isSessionExpired: false
        }
    },
    reducers: {
        setSnackbar: (state, action) => {
            state.snackbar = action.payload;
        },
        // setSessionExpired: (state, action) => {
        //     state.auth.isSessionExpired = action.payload;
        // }
    },
});

export const { setSnackbar, setSessionExpired } = global.actions;
export default global.reducer;
