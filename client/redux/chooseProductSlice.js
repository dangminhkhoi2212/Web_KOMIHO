import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    product: {},
    status: '',
};

const chooseProductSlice = createSlice({
    name: 'choose-product',
    initialState,
    reducers: {
        chooseProduct: (state, action) => {
            const {
                _id,
                userId,
                name,
                price,
                colors,
                tags,
                description,
                images,
                store,
            } = action.payload;
            state.product = {
                _id,
                userId,
                name,
                price,
                colors,
                tags,
                description,
                images,
                store,
            };
        },
        chooseStatus: (state, action) => {
            const status = action.payload;
            state.status = status;
        },
        removeChooseProduct: () => initialState,
    },
});
export const { chooseProduct, removeChooseProduct, chooseStatus } =
    chooseProductSlice.actions;
export default chooseProductSlice.reducer;
