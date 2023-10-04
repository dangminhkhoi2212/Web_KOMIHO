import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    product: null,
    cartItemId: '',
    select: {
        color: '',
        size: '',
        quantity: 0,
    },
};
const cartItemSlice = createSlice({
    name: 'cart-item',
    initialState,
    reducers: {
        setCartItem: (state, action) => {
            const { product, select, cartItemId } = action.payload;
            state.product = product;
            state.cartItemId = cartItemId;
            state.select = select;
        },
        resetCartItem: () => initialState,
    },
});
export const { setCartItem, resetCartItem } = cartItemSlice.actions;
export default cartItemSlice.reducer;
