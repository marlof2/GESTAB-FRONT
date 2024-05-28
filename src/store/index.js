import { configureStore } from '@reduxjs/toolkit';
import EstablishmentReducer from '../pages/Establishment/reducer/slice';

export const store = configureStore({
  reducer: {
    establishment: EstablishmentReducer,
  },
});

