import mongoose from 'mongoose';
import Feedback from '../models/feedback.model.js';
import ApiError from '../utils/apiError.js';
import Product from '../models/product.model.js';
export const createFeedBack = async (req, res, next) => {
    try {
        const {
            userId,
            sellerId,
            productId,
            stars,
            content,
            images,
            orderItemId,
        } = req.body;

        let fieldUpdate;
        switch (stars) {
            case 1:
                fieldUpdate = 'ratingsCount.one';
                break;
            case 2:
                fieldUpdate = 'ratingsCount.two';
                break;
            case 3:
                fieldUpdate = 'ratingsCount.three';
                break;
            case 4:
                fieldUpdate = 'ratingsCount.four';
                break;
            case 5:
                fieldUpdate = 'ratingsCount.five';
                break;
        }
        const [result, product] = await Promise.all([
            Feedback.create({
                userId,
                sellerId,
                productId,
                orderItemId,
                stars,
                content,
                images,
                isFeedback: true,
            }),
            Product.findByIdAndUpdate(
                productId,
                {
                    $inc: { [fieldUpdate]: 1 },
                },
                { new: true },
            ),
        ]);

        const totalFeedbacks = Object.keys(product.ratingsCount).reduce(
            (total, key, index) => {
                total += product.ratingsCount[key] * (5 - index);
                return total;
            },
            0,
        );
        const ratingsTotal = Object.keys(product.ratingsCount).reduce(
            (total, key, index) => {
                total += product.ratingsCount[key];
                return total;
            },
            0,
        );

        product.ratingsTotal = ratingsTotal;
        product.ratingsAverage = totalFeedbacks / ratingsTotal;
        await product.save();
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getFeedback = async (req, res, next) => {
    try {
        const { productId, userId, orderItemId, stars } = req.query;
        const queryTemp = {
            productId: productId && new mongoose.Types.ObjectId(productId),
            userId: userId && new mongoose.Types.ObjectId(userId),
            orderItemId:
                orderItemId && new mongoose.Types.ObjectId(orderItemId),
            stars,
        };
        const query = JSON.parse(JSON.stringify(queryTemp));

        if (Object.keys(query).length === 0) return res.send({ result: 0 });
        const result = await Feedback.find(query).populate(
            'userId',
            'name avatar',
        );
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
