import { createSlice } from '@reduxjs/toolkit';

export const resoucerSlice = createSlice({
  name: 'schedule',
  initialState: {
    modalDelete: {
      data: {},
      visible: false,
    },
    reloadCards: false,
  },
  reducers: {
    infoModalDelete: (state, action) => {
      state.modalDelete = action.payload;
    },
    reloadItemsCard: (state, action) => {
      state.reloadCards = action.payload;
    },
  },
});

export const { reloadItemsCard, infoModalDelete, } = resoucerSlice.actions;
export default resoucerSlice.reducer;
