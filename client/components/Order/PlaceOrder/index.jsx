import Loading from '@/components/Loading';
import { Button } from 'flowbite-react';
import { setCartLength } from '@/redux/cartSlice';
import { resetCheckOut } from '@/redux/checkoutSlice';
import {
    getCartList,
    getListProductCheckOut,
    getPickupAddress,
    getUserId,
} from '@/redux/selector';
import routes from '@/routes';
import { deleteCart } from '@/services/cart.service';
import { createOrder } from '@/services/order.service';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PlaceOrder = ({ productCheckOut }) => {
    const total = productCheckOut.reduce((sum, cartItem) => {
        sum += cartItem.total;
        return sum;
    }, 0);
    const router = useRouter();
    const disPatch = useDispatch();
    const userId = useSelector(getUserId);
    const pickupAddress = useSelector(getPickupAddress);
    const selectProductInCart = useSelector(getCartList);

    const deleteCartMutation = useMutation({
        mutationFn: (cartIds) => {
            return deleteCart({ userId, cartIds });
        },
        onSuccess(data) {
            console.log('🚀 ~ file: index.jsx:36 ~ onSuccess ~ data:', data);
            disPatch(setCartLength({ cartLength: data.cartLength }));
            toast('Placed order successfully');
            router.push(routes.myPurchase);
        },
        onError(error) {
            toast.error('Placed order failed. Please try again.');
        },
    });
    const placeOrderMutation = useMutation({
        mutationFn: (data) => {
            return createOrder(data);
        },
        onSuccess(data) {
            const temp = selectProductInCart.filter(
                (product) => product.checked,
            );
            const cartIds = temp.map((product) => product._id);
            deleteCartMutation.mutate(cartIds);
        },
        onError(error) {
            toast.error('Placed order failed. Please try again.');
        },
    });
    const handlePlaceOrder = () => {
        if (!pickupAddress) return toast.error('Update your pickup address.');
        const orderData = productCheckOut.map((cartItem) => {
            const productIds = cartItem.products.map((product) => {
                return {
                    product: {
                        name: product.productId.name,
                        price: product.productId.price,
                        images: {
                            url: product.productId.images[0].url,
                        },
                    },
                    select: product.select,
                };
            });
            return {
                userId: cartItem._id.userId,
                sellerId: cartItem._id.sellerId._id,
                total: cartItem.total,
                items: productIds,
                pickupAddress,
                storeAddress: cartItem._id.sellerId.address.store,
            };
        });

        placeOrderMutation.mutate(orderData);
    };
    return (
        <div className="rounded-md bg-white flex justify-end flex-col ">
            <div className="flex justify-end items-end gap-3 px-5 py-3">
                <div>
                    <p>Total Payment:</p>
                </div>
                <NumericFormat
                    value={total}
                    thousandSeparator
                    displayType="text"
                    suffix={' VND'}
                    renderText={(value) => (
                        <span className="font-medium text-red-500 text-xl">
                            {value}
                        </span>
                    )}
                />
            </div>
            <div className="border-t-2 border-dashed px-5 py-3 ">
                <Button
                    className="float-right bg-primary hover:!bg-primary"
                    isProcessing={
                        placeOrderMutation.isLoading ||
                        deleteCartMutation.isLoading
                    }
                    onClick={() => handlePlaceOrder()}>
                    PLACE ORDER
                </Button>
            </div>
        </div>
    );
};

export default PlaceOrder;
