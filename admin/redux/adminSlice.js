import { createSlice } from '@reduxjs/toolkit';
const adminSlice = createSlice({
    name: 'admin',
    initialState: {},
    reducers: {
        setAdmin: (state, action) => {
            return action.payload;
        },
    },
});
const setAdmin = adminSlice.actions.setAdmin;
const reducer = adminSlice.reducer;

export { setAdmin };
export default reducer;
