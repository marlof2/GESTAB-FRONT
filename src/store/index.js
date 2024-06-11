import { configureStore } from '@reduxjs/toolkit';
import EstablishmentReducer from '../pages/Establishment/reducer';
import EstablishmentUserReducer from '../pages/EstablishmentUser/reducer';
import ServiceReducer from '../pages/Service/reducer';
import GlobalReducer from './globalSlice';

export const store = configureStore({
  reducer: {
    establishment: EstablishmentReducer,
    establishmentUser: EstablishmentUserReducer,
    service: ServiceReducer,
    global: GlobalReducer,
  },
});

