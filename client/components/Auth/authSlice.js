import { createSlice } from '@reduxjs/toolkit';

const Slice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
    },
});
export const { setUser } = Slice.actions;
const reducer = Slice.reducer;
export default reducer;
