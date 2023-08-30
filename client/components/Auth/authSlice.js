import { createSlice } from '@reduxjs/toolkit';

const Slice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser: (state, action) => {
            const { accessToken, refreshToken, ...data } = action.payload;
            return data;
        },
    },
});
export const { setUser } = Slice.actions;
const reducer = Slice.reducer;
export default reducer;
