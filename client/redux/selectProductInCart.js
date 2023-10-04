import { createSlice } from '@reduxjs/toolkit';
import cartItem from './cartItem';
const initialState = {
    list: [],
};
const selectProductInCart = createSlice({
    name: 'select-product-in-cart',
    initialState,
    reducers: {
        addSelectProductInCart: (state, action) => {
            const cartItems = action.payload;
            if (cartItems.length) state.list.push(...cartItems);
        },
        removeSelectProductInCart: (state, action) => {
            const cartItems = action.payload;
            const ids = cartItems.map((cart) => cart._id);
            state.list = state.list.filter(
                (cartItem) => !ids.includes(cartItem._id),
            );
        },
        updateSelectOneCartItem: (state, action) => {
            const { _id, select } = action.payload;
            state.list.forEach((cartItem) => {
                if (cartItem._id === _id) {
                    cartItem.select = select;
                }
            });
        },
        resetSelectProductInCart: () => initialState,
    },
});

export const {
    addSelectProductInCart,
    removeSelectProductInCart,
    resetSelectProductInCart,
    updateSelectOneCartItem,
} = selectProductInCart.actions;
export default selectProductInCart.reducer;
