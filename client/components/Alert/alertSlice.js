import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
const Slice = createSlice({
    name: 'alert',
    initialState: { status: '', message: '' },
    reducers: {
        setAlert: (state, action) => {
            const { id, status, message } = action.payload;
            state.id = uuidv4();
            state.status = status;
            state.message = message;
            const temp = setTimeout(() => {
                state.status = '';
                state.message = '';
            }, 3500);
            clearTimeout(temp);
        },
    },
});
export const { setAlert } = Slice.actions;
const reducer = Slice.reducer;
export default reducer;
