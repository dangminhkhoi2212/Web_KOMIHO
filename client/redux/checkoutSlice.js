import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: [],
};
const checkOutSlice = createSlice({
    name: 'check-out',
    initialState,
    reducers: {
        createCheckOut: (state, action) => {
            var { cartItems } = action.payload;
            cartItems = cartItems.map((cartItem) => {
                let total = cartItem.products.reduce(
                    (sum, { productId, select }) => {
                        sum += productId.price.final * select.quantity;
                        return sum;
                    },
                    0,
                );
                return { ...cartItem, total };
            });
            if (cartItems?.length) {
                state.list = cartItems;
            }
        },
        resetCheckOut: () => initialState,
    },
});
export const { createCheckOut, resetCheckOut } = checkOutSlice.actions;
export default checkOutSlice.reducer;
