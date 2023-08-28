import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, max: 30, min: 0 },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        phone: {
            type: String,
            minLength: [10, 'no should have minimum 10 digits'],
            maxLength: [10, 'no should have maximum 10 digits'],
            match: [/\d{10}/, 'no should only have digits'],
            default: null,
        },
        password: {
            type: String,
            trim: true,
        },
        image: {
            public_id: { type: String },
            url: { type: String },
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
        bank: {
            name: { type: String, trim: true },
            number: { type: String, trim: true },
        },
        emailVerified: { type: Boolean, default: false },
        viaGoogle: { type: Boolean, default: false },
        refreshToken: { type: String },
        typeUser: { type: String, required: true, trim: true, default: 'user' },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
export default mongoose.model('Users', UserSchema);
