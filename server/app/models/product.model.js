import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        name: { type: String, required: true, maxLength: 100 },
        price: {
            origin: { type: Number, required: true },
            percent: { type: Number, default: 0 },
            final: { type: String, required: true },
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
        rating: { type: String },
        type: { type: String, required: true },
        tags: { type: String },
        description: { type: String },
        images: [{ url: { type: String }, public_id: { type: String } }],
        views: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
        store: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
const Product = mongoose.model('Product', ProductSchema);

export default Product;
