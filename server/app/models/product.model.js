import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 100, unique: true },
        price: {
            origin: { type: Number, required: true },
            percentDiscount: { type: Number, default: 0 },
        },
        color: [
            {
                name: { type: String, required: true },
                size: [
                    {
                        type: { type: String, required: true },
                        quantity: {
                            type: Number,
                            required: true,
                            minLength: 0,
                        },
                    },
                ],
            },
        ],

        description: { type: String, required: true },
        images: [{ url: { type: String }, public_id: { type: String } }],
        views: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export default mongoose.model('Product', ProductSchema);
