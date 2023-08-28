import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from './storage';
import userReducer from '@/components/Auth/authSlice';
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducerAdmin = persistReducer(persistConfig, userReducer);

const store = configureStore({
    reducer: {
        user: persistedReducerAdmin,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

const persistor = persistStore(store);
export { store, persistor };
