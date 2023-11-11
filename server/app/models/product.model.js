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
        sold: { type: Number, default: 0 },
        ratingsAverage: { type: Number, default: 0 },
        ratingsTotal: { type: Number, default: 0 },
        ratingsCount: {
            five: { type: Number, default: 0 },
            four: { type: Number, default: 0 },
            three: { type: Number, default: 0 },
            two: { type: Number, default: 0 },
            one: { type: Number, default: 0 },
        },
        tags: { type: String },
        description: { type: String },
        images: [{ url: { type: String }, public_id: { type: String } }],
        views: { type: Number, default: 0 },

        public: { type: Boolean, default: true },
        active: { type: Boolean, default: true },
        lock: {
            status: { type: Boolean, default: false },
            reason: { type: String, max: 5000, trim: true },
        },
    },
    {
        timestamps: true,
    },
);
const Product = mongoose.model('Product', ProductSchema);

export default Product;
