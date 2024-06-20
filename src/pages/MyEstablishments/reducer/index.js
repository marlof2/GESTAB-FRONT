import { createSlice } from '@reduxjs/toolkit';

export const resoucerSlice = createSlice({
  name: 'MyEstablishment',
  initialState: {
    establishiments: [],
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
    addOrRemoveEstablishmentInArray: (state, action) => {
      const exist = state.establishiments.includes(action.payload)
      
      if (exist) {
        const index = state.establishiments.indexOf(action.payload);
        if (index > -1) {
          state.establishiments.splice(index, 1);
        }
      } else {
        state.establishiments.push(action.payload)
      }
      
    },
    resetArrayEstablishments:(state, action) => {
      state.establishiments = []
    }
  },
});

export const { reloadItemsCard, infoModalDelete, addOrRemoveEstablishmentInArray, resetArrayEstablishments } = resoucerSlice.actions;
export default resoucerSlice.reducer;
