import { createSlice } from '@reduxjs/toolkit';

export const resoucerSlice = createSlice({
  name: 'Service',
  initialState: {
    modal: {
      action:'create',
      visible: false,
      data:{}
    },
    modalDelete: {
      id: null,
      visible: false,
    },
    reloadCards: false,
  },
  reducers: {
    infoModal: (state, action) => {
      state.modal = action.payload;
    },
    infoModalDelete: (state, action) => {
      state.modalDelete = action.payload;
    },
    reloadItemsCard: (state, action) => {
      state.reloadCards = action.payload;
    },
  },
});

export const { infoModal, reloadItemsCard, infoModalDelete } = resoucerSlice.actions;
export default resoucerSlice.reducer;
