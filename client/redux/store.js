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
import recoverAccountReducer from '@/components/RecoverAccount/recoverAccountSlice';
import filterSearchReducer from './filterSearchSlice';
import listDeletedImagesReducer from './listDeletedImages';
import chooseProductReducer from './chooseProductSlice';
import selectProductInTableReducer from './selectProductInTable';
import cartReducer from './cartSlice';
import checkOutReducer from './checkoutSlice';
const persistConfig = {
    key: 'user',
    version: 1,
    storage,
};
const persistedReducerAdmin = persistReducer(persistConfig, userReducer);
const store = configureStore({
    reducer: {
        user: persistedReducerAdmin,
        recoverAccount: recoverAccountReducer,
        filterSearch: filterSearchReducer,
        listDeletedImages: listDeletedImagesReducer,
        chooseProduct: chooseProductReducer,
        selectProductInTable: selectProductInTableReducer,
        cart: cartReducer,
        checkOut: checkOutReducer,
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
export const resetAllReducers = () => {
    const resetAction = {
        type: 'RESET_ALL_REDUCERS',
    };
    store.dispatch(resetAction);
};
const persistor = persistStore(store);
export { store, persistor };
