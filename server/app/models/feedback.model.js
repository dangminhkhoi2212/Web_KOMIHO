import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MAX_LENGTH_IMAGES = 5;
const arrLimit = (val) => {
    return val.length <= MAX_LENGTH_IMAGES;
};
const feedbackSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        orderItemId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        stars: { type: Number, default: 1, min: 1, max: 5 },
        images: {
            type: [
                {
                    url: { type: String },
                    public_id: { type: String },
                },
            ],
            validate: [arrLimit, 'Maximum 5 photos'],
        },

        content: { type: String, trim: true, max: 500 },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export default mongoose.model('Feedback', feedbackSchema);
