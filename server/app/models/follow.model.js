import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MAX_LENGTH_FOLLOW = 5000;
const followModel = new Schema(
    {
        requester: { type: mongoose.Types.ObjectId, ref: 'User' },
        recipient: { type: mongoose.Types.ObjectId, ref: 'User' },
        status: {
            type: String,
            enum: ['following', 'friend'],
        },
    },
    {
        timestamp: true,
        versionKey: false,
    },
);
export default mongoose.model('Follow', followModel);
