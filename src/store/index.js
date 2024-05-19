import { configureStore } from '@reduxjs/toolkit';

// Reducer para gerenciar estados de mensagens
const getMessagesError = (state = '') => {
    return state;
};

const store = configureStore({
    reducer: {
        message: getMessagesError
    }
});

export const setMessagesError = message => (message);


export default store;
