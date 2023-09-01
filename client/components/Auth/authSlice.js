import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    _id: null,
    name: null,
    email: null,
    phone: null,
    address: {
        sub: null,
        main: null,
    },
    avatar: {
        url: null,
    },
};
const Slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const data = action.payload;
            state._id = data._id;
            state.name = data.name;
            state.email = data.email;
            state.phone = data.phone;
            state.address = data.address;
            state.avatar = data.avatar;
        },
        resetUser: (state, action) => {
            return initialState;
        },
    },
});
export const { setUser, resetUser } = Slice.actions;
const reducer = Slice.reducer;
export default reducer;
