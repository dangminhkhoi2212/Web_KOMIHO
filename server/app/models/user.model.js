import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const URL_DEFAULT_AVATAR =
    'https://res.cloudinary.com/dakwyskfm/image/upload/v1698637143/komiho/image_default/1da7ac6b68f80d499ad5427665d3d617_wdiibp.png';
const UserSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, max: 30, min: 0 },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            maxLength: [10, 'no should have maximum 10 digits'],
            match: [/\d{10}/, 'no should only have digits'],
            default: null,
        },
        password: {
            type: String,
            min: 6,
            trim: true,
        },
        avatar: {
            public_id: { type: String },
            url: { type: String, default: URL_DEFAULT_AVATAR },
        },
        address: {
            pickup: {
                main: { type: String, trim: true, max: 100 },
                sub: { type: String, trim: true, max: 100 },
            },
            store: {
                main: { type: String, trim: true, max: 100 },
                sub: { type: String, trim: true, max: 100 },
            },
        },

        productTotal: { type: Number, default: 0 },
        emailVerified: { type: Boolean, default: false },
        viaGoogle: { type: Boolean, default: false },
        refreshToken: { type: String },
        public: { type: Boolean, default: true }, // role as delete or block
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
const User = mongoose.model('User', UserSchema);
export default User;
