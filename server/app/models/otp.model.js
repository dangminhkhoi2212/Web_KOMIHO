import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OtpSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        email: { type: String, required: true, unique: true, trim: true },
        otp: {
            type: String,
            required: true,
            trim: true,
        },
        used: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export default mongoose.model('Otp', OtpSchema);
