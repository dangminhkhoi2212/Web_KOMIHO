import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true, maxLength: 200 },
        price: {
            origin: { type: Number, required: true, default: 0 },
            percent: { type: Number, default: 0 },
            final: { type: Number, required: true, default: 0 },
        },
        colors: [
            {
                name: { type: String, required: true },
                sizes: [
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
        tags: { type: String },
        description: { type: String },
        images: [{ url: { type: String }, public_id: { type: String } }],
        views: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
        store: { type: Number, default: 0 },
        public: { type: Boolean, default: true },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
);
const Product = mongoose.model('Product', ProductSchema);

export default Product;
