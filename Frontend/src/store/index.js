import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import localStorageMiddleware from './localStorageMiddleware';
// Create the Redux store
export const store = configureStore({
    reducer: {
        auth: authReducer, // The auth slice is now part of the store
    },
    // You can add middleware here if needed
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myCustomMiddleware),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;