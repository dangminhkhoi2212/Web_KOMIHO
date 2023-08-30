import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
const productColor = createSlice({
    name: 'productColor',
    initialState: [
        {
            id: uuidv4(),
            name: '',
            sizes: [{ id: uuidv4(), type: '', quantity: 0 }],
        },
    ],
    reducers: {
        addColor: (state, action) => {
            console.log('add');
            state.push(action.payload);
        },
        changeColorName: (state, action) => {
            const { id, newColorName } = action.payload;

            return state.map((color) => {
                if (color.id === id) {
                    return { ...color, name: newColorName };
                }
                return color;
            });
        },
        removeColor: (state, action) => {
            const idColor = action.payload.idColor;
            return state.filter((color) => color.id !== idColor);
        },
        addSize: (state, action) => {
            const { idColor, size } = action.payload;
            console.log(
                '🚀 ~ file: productColorSlice.js:33 ~ { idColor, size }:',
                { idColor, size },
            );

            const color = state.find((color) => color.id === idColor);
            if (color) color.sizes.push(size); // Use 'sizes' instead of 'size'
        },
        changeSize: (state, action) => {
            const { idColor, idSize, type } = action.payload;
            const color = state.find((color) => color.id === idColor);
            if (color) {
                const size = color.sizes.find((size) => size.id === idSize); // Use 'sizes' instead of 'size'
                if (size) {
                    size.type = type;
                }
            }
        },
        removeSize: (state, action) => {
            const { idColor, idSize } = action.payload;
            const color = state.find((color) => color.id === idColor);
            if (color) {
                color.sizes = color.sizes.filter((size) => size.id !== idSize); // Use 'sizes' instead of 'size'
            }
        },
        changeQuantity: (state, action) => {
            const { idColor, idSize, quantity } = action.payload;
            const color = state.find((color) => color.id === idColor);
            if (color) {
                const size = color.sizes.find((size) => size.id === idSize); // Use 'sizes' instead of 'size'
                if (size) {
                    size.quantity = quantity;
                }
            }
        },
    },
});
export const {
    addColor,
    changeColorName,
    removeColor,
    addSize,
    changeSize,
    removeSize,
    changeQuantity,
} = productColor.actions;
export default productColor.reducer;
