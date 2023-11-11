import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import ApiError from '../utils/apiError.js';
import Product from '../models/product.model.js';
export const createOrder = async (req, res, next) => {
    try {
        //==> orders shape:
        // userId
        // sellerId
        // total
        // items:{
        //         product: {
        //             productId,
        //             name,
        //             price,
        //             images: {
        //                 url,
        //             },
        //         },
        //         select,
        //       }
        // pickupAddress,
        // storeAddress
        const { orders } = req.body;

        if (!orders?.length) return next(new ApiError(400, 'Empty order.'));
        const itemsList = orders.map((order) => order.items).flat();

        const checkQuantity = itemsList.map(async (item) => {
            const { product, select } = { ...item };

            const productCheck = await Product.findById(
                product.productId,
            ).lean();
            if (!productCheck) return false;

            const color = productCheck.colors.find(
                (color) => color.name === select.color,
            );
            if (!color) return false;

            const size = color.sizes.find((size) => size.type === select.size);
            if (!size) return false;

            const valid = size.quantity >= select.quantity;
            const err = `${product.name}, color ${select.color}, size ${select.size} SOLD OUT`;
            if (!valid) return next(new ApiError(400, err));
            return true;
        });
        const [check] = await Promise.all(checkQuantity);

        if (!check) return next(new ApiError(500, 'Sold out'));
        const result = await Order.insertMany(orders);
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const getOrder = async (req, res, next) => {
    try {
        const { userId, status, sellerId, orderId } = req.query;

        const queryProperties = {
            userId: userId && new mongoose.Types.ObjectId(userId),
            sellerId: sellerId && new mongoose.Types.ObjectId(sellerId),
            _id: orderId && new mongoose.Types.ObjectId(orderId),
            status: status || undefined,
        };
        const query = Object.keys(queryProperties)
            .filter((key) => queryProperties[key] !== undefined)
            .reduce((result, key) => {
                result[key] = queryProperties[key];
                return result;
            }, {});

        console.log(
            '🚀 ~ file: order.controller.js:32 ~ getOrder ~ query:',
            query,
        );
        const result = await Order.find(query)
            .populate('sellerId', 'name avatar.url address.store phone')
            .populate('userId', 'name avatar.url address.pickup phone')
            .sort({ _id: -1 });
        res.send(result);
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
export const updateOrder = async (req, res, next) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId) return next(new ApiError(400, 'orderId not found.'));
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new ApiError(404, 'Order not found.'));
        }

        if (status === 'delivered') {
            const items = order.items;

            const updatePromises = items.map(async (item) => {
                const { product, select } = item;
                const { productId } = product;
                const { color, size, quantity } = select;

                // Update the product's quantity for the selected color and size
                return await Product.findOneAndUpdate(
                    {
                        _id: new mongoose.Types.ObjectId(productId),
                        'colors.name': color,
                        'colors.sizes.type': size,
                    },
                    {
                        $inc: {
                            'colors.$.sizes.$[elem].quantity': -quantity, // Use $[elem] to specify the filtered array element
                        },
                    },
                    {
                        arrayFilters: [{ 'elem.type': size }], // Filter the array element
                    },
                );
            });

            // Update the sold quantity for each product in the order
            await Product.updateMany(
                {
                    _id: {
                        $in: order.items.map((item) => item.product.productId),
                    },
                },
                { $inc: { sold: 1 } },
            );
            await Promise.all(updatePromises);
        }

        const result = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true },
        );

        res.send({ ok: true, result });
    } catch (error) {
        next(new ApiError(error.code || 500, error.message || error));
    }
};
