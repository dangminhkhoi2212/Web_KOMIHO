import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    textSearch: '',
    price: '',
    store: '',
    page: 1,
    limit: 4,
};
const filterSearch = createSlice({
    name: 'filter-search',
    initialState,
    reducers: {
        setTextSearch: (state, action) => {
            state.page = 1;
            state.textSearch = action.payload;
        },
        setPrice: (state, action) => {
            state.page = 1;
            state.store = '';
            state.price = action.payload;
        },
        setStore: (state, action) => {
            state.page = 1;
            state.price = '';
            state.store = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
    },
});

export const { setPrice, setStore, setPage, setLimit, setTextSearch } =
    filterSearch.actions;

export default filterSearch.reducer;
