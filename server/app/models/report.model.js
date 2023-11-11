import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reportModel = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
    content: { type: String, max: 3000, default: '' },
    isHandle: { type: Boolean, default: false },
});
export default mongoose.model('Report', reportModel);
