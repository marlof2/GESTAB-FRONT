import { createSlice } from '@reduxjs/toolkit';

export const establishmentSlice = createSlice({
  name: 'establishment',
  initialState: {
    modal: {
      visible: false,
    },
    snackbar: {
      visible: false,
      title: ''
    },
    reloadCards: false,
  },
  reducers: {
    infoModal: (state, action) => {
      state.modal = action.payload;
    },
    reloadItemsCard: (state, action) => {
      state.reloadCards = action.payload;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
  },
});

export const { infoModal, reloadItemsCard } = establishmentSlice.actions;
export default establishmentSlice.reducer;
