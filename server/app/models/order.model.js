import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
        orderDate: { type: String, default: new Date().toISOString() },
        pickupAddress: {
            main: { type: String, trim: true, max: 100 },
            sub: { type: String, trim: true, max: 100 },
        },
        storeAddress: {
            main: { type: String, trim: true, max: 100 },
            sub: { type: String, trim: true, max: 100 },
        },
        deliveredDate: {
            type: String,
            default: new Date(
                new Date().setDate(new Date().getDate() + 3),
            ).toISOString(),
        }, // default delivery in 3 days
        items: [
            {
                product: {
                    name: { type: String, required: true, maxLength: 200 },
                    price: {
                        origin: { type: Number, required: true, default: 0 },
                        percent: { type: Number, default: 0 },
                        final: { type: Number, required: true, default: 0 },
                    },
                    images: {
                        url: { type: String },
                    },
                },
                select: {
                    color: { type: String, required: true },
                    size: { type: String, required: true },
                    quantity: { type: String, required: true },
                },
            },
        ],
        total: { type: Number, default: 0 },
        status: {
            type: String,
            enum: [
                'delivering',
                'delivered',
                'cancelled',
                'pending',
                'delivery-failed',
            ],
            default: 'pending',
        },
        payment: { type: Boolean, default: true },
        note: { type: String, max: 2000, trim: true },
    },
    { timestamps: true, versionKey: false },
);
export default mongoose.model('Order', orderSchema);
