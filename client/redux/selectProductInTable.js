import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const selectProductInTable = createSlice({
    name: 'select-product-in-table',
    initialState,
    reducers: {
        setSelectProductInTable: (state, action) => {
            if (action.payload.length) {
                const productIds = action.payload.map((item) => item._id);
                return productIds;
            }
        },
        resetSelectProductInTable: () => initialState,
    },
});
export const { setSelectProductInTable, resetSelectProductInTable } =
    selectProductInTable.actions;
export default selectProductInTable.reducer;
