import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: [],
    allowDeleted: false,
};
const listDeletedImages = createSlice({
    name: 'list-deleted-images',
    initialState,
    reducers: {
        addDeletedImages: (state, action) => {
            const image = action.payload;
            if (Object.entries(image).length !== 0) {
                const check = state.list.some(
                    (img) => img.public_id === image.public_id,
                );
                if (!check)
                    state.list.push({
                        url: image.url,
                        public_id: image.public_id,
                    });
            }
        },
        removeDeletedImages: (state, action) => {
            const image = action.payload;
            const newState = state.list.filter(
                (img) => img.public_id != image.public_id,
            );
            state.list = newState;
        },
        setAllowDeleted: (state, action) => {
            console.log(
                '🚀 ~ file: listDeletedImages.js:23 ~ action.payload:',
                action.payload,
            );
            state.allowDeleted = action.payload;
        },
        resetListDeletedImages: () => initialState,
    },
});
export const {
    addDeletedImages,
    resetListDeletedImages,
    setAllowDeleted,
    removeDeletedImages,
} = listDeletedImages.actions;
export default listDeletedImages.reducer;
