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
import adminReducer from './adminSlice';
import productColor from '@/components/FormAddProduct/productColorSlice';
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducerAdmin = persistReducer(persistConfig, adminReducer);

const store = configureStore({
    reducer: {
        admin: persistedReducerAdmin,
        productColor,
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
