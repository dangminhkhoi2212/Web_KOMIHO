import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MAX_LENGTH_FAVORITE = 5000;
const favoriteModel = new Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        favorites: {
            type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
            validate: [
                (value) => value.length <= MAX_LENGTH_FAVORITE,
                'Favorite list max 5000',
            ],
        },
    },
    {
        timestamp: true,
        versionKey: false,
    },
);
export default mongoose.model('Favorite', favoriteModel);
