import { createSlice } from '@reduxjs/toolkit';

export const resoucerSlice = createSlice({
  name: 'schedule',
  initialState: {
    modal: {
      action: 'create',
      visible: false,
      data: {
        establishment_id: null
      }
    },
    modalDelete: {
      data: {},
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

export const { reloadItemsCard, infoModalDelete, infoModal } = resoucerSlice.actions;
export default resoucerSlice.reducer;
