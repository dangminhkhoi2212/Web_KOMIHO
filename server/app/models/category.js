import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        public: { type: Boolean, default: true },
    },
    { timestamps: true },
);
const Category = mongoose.model('Category', CategorySchema);
export default Category;
