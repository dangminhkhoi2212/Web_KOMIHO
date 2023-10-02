import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
};
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state, action) => {
            const {
                _id,
                name,
                images,
                colors,
                sizes,
                price,
                color,
                size,
                quantity,
            } = action.payload;

            state.list.push({
                _id,
                name,
                images,
                colors,
                sizes,
                price,
                color,
                size,
                quantity,
            });
        },
        deleteProductFromCart: (state, action) => {
            const { productId, color, size, quantity } = action.payload;
            state = state.filter(
                (product) =>
                    product.productId !== productId &&
                    product.color !== color &&
                    product.size !== size &&
                    product.quantity !== quantity,
            );
        },
        resetCart: () => initialState,
    },
});
export const { addProductToCart, deleteProductFromCart, resetCart } =
    cartSlice.actions;
export default cartSlice.reducer;
