import { createSlice } from '@reduxjs/toolkit';

const recoverSlice = createSlice({
    name: 'recoverAccount',
    initialState: {
        email: null,
    },
    reducers: {
        setEmailRecover: (state, action) => {
            state.email = action.payload;
        },
    },
});
export const { setEmailRecover } = recoverSlice.actions;
export default recoverSlice.reducer;
