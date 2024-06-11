import { createSlice } from '@reduxjs/toolkit';

export const resoucerSlice = createSlice({
  name: 'establishmentUser',
  initialState: {
    professionals: [],
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
    addOrRemoveProfessionalInArray: (state, action) => {
      const exist = state.professionals.includes(action.payload)
      
      if (exist) {
        const index = state.professionals.indexOf(action.payload);
        if (index > -1) {
          state.professionals.splice(index, 1);
        }
      } else {
        state.professionals.push(action.payload)
      }
      
    },
    resetArrayProfessional:(state, action) => {
      state.professionals = []
    }
  },
});

export const { reloadItemsCard, infoModalDelete, addOrRemoveProfessionalInArray, resetArrayProfessional } = resoucerSlice.actions;
export default resoucerSlice.reducer;
