import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
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
    { timestamps: true, versionKey: false },
);
export default mongoose.model('Cart', CartSchema);
