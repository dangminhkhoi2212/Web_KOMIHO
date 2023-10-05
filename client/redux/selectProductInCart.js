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
            const data = [];
            cartItems.forEach((cartItem) => {
                const count = state.list.filter(
                    (x) => x._id === cartItem._id,
                ).length;
                if (count === 0) {
                    data.push(cartItem);
                }
            });
            if (cartItems.length) state.list.push(...data);
        },
        removeSelectProductInCart: (state, action) => {
            const cartItems = action.payload;
            const ids = cartItems.map((cart) => cart._id);
            state.list = state.list.filter(
                (cartItem) => !ids.includes(cartItem._id),
            );
        },

        initSelectProductInCart: (state, action) => {
            const cartItems = action.payload;
            if (cartItems?.length) {
                state.list = cartItems.map((cartItem) => {
                    return { ...cartItem, checked: false };
                });
            }
        },
        clickAllSelectProductsInCart: (state, action) => {
            const { checked } = action.payload;
            state.list = state.list.map((cartItem) => {
                return { ...cartItem, checked };
            });
        },
        clickOnSellerProductInCart: (state, action) => {
            const { sellerId, checked } = action.payload;
            state.list = state.list.map((cartItem) => {
                if (cartItem.productId.userId === sellerId) {
                    return {
                        ...cartItem,
                        checked,
                    };
                }
                return cartItem;
            });
        },
        clickOnProductInCart: (state, action) => {
            const { cartItemId, checked, select } = action.payload;
            console.log(
                '🚀 ~ file: selectProductInCart.js:59 ~ { cartItemId, checked, select } :',
                { cartItemId, checked, select },
            );
            state.list = state.list.map((cartItem) => {
                const check =
                    cartItem._id === cartItemId &&
                    cartItem.select.size === select.size &&
                    cartItem.select.color === select.color &&
                    cartItem.select.quantity === select.quantity;
                console.log(
                    '🚀 ~ file: selectProductInCart.js:66 ~ state.list=state.list.map ~ check:',
                    check,
                );
                if (check) {
                    return {
                        ...cartItem,
                        checked,
                    };
                }
                return cartItem;
            });
        },
        updateSelectOneCartItem: (state, action) => {
            const { _id, select } = action.payload;

            state.list = state.list.map((cartItem) => {
                if (cartItem._id === _id) {
                    return {
                        ...cartItem,
                        select,
                    };
                }
                return cartItem;
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
    initSelectProductInCart,
    clickAllSelectProductsInCart,
    clickOnSellerProductInCart,
    clickOnProductInCart,
} = selectProductInCart.actions;
export default selectProductInCart.reducer;
