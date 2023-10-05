import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CartItemModel = new Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        select: {
            color: { type: String, required: true },
            size: { type: String, required: true },
            quantity: { type: Number, required: true, default: 0 },
        },
    },
    { timestamps: true },
);
export default mongoose.model('CartItem', CartItemModel);
