import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'CartItem',
                max: 20,
            },
        ],
    },
    { timestamps: true },
);
export default mongoose.model('Cart', CartSchema);
