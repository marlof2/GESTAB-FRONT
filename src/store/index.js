import { configureStore } from '@reduxjs/toolkit';
import EstablishmentReducer from '../pages/Establishment/reducer';
import MyEstablishments from '../pages/MyEstablishments/reducer';
import EstablishmentUserReducer from '../pages/EstablishmentUser/reducer';
import ServiceReducer from '../pages/Service/reducer';
import GlobalReducer from './globalSlice';

export const store = configureStore({
  reducer: {
    global: GlobalReducer,
    establishment: EstablishmentReducer,
    establishmentUser: EstablishmentUserReducer,
    myEstablishments : MyEstablishments,
    service: ServiceReducer,
  },
});

