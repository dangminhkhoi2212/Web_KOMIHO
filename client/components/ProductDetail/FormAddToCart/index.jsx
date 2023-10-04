'use client';
import Color from '@/components/ProductDetail/FormAddToCart/Color';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { addToCartSchema } from '@/utils/validation';
import { toast } from 'react-toastify';
import Quantity from './Quantity';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '@/redux/cartSlice';
import { getCart, getUserId } from '@/redux/selector';
import { useRouter } from 'next/navigation';
import routes from '@/routes';
import { useMutation } from '@tanstack/react-query';
import { createCartItem } from '@/services/cartItem.service';
import { data } from 'autoprefixer';
import { addToCart } from '@/services/cart.service';
import Loading from '@/components/Loading';
const FormAddToCart = ({ product }) => {
    const userId = useSelector(getUserId);
    const router = useRouter();
    const defaultValues = {
        color: '',
        size: '',
        quantity: 1,
    };
    const methods = useForm({
        defaultValues,
        resolver: yupResolver(addToCartSchema),
    });
    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const dispatch = useDispatch();
    const cart = useSelector(getCart);
    useEffect(() => {
        toast.error(
            errors?.color?.message ||
                errors?.size?.message ||
                errors?.quantity?.message,
        );
    }, [errors]);
    const createCartItemMutation = useMutation({
        mutationFn: (data) => {
            return createCartItem({ productId: product._id, select: data });
        },
        onSuccess(data) {
            const { _id } = data;
            addToCartMutation.mutate(_id);
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'An error occurred, please try again.',
            );
        },
    });
    const addToCartMutation = useMutation({
        mutationFn: (cartItemId) => {
            return addToCart({
                userId,
                sellerId: product.userId._id,
                cartItemId,
            });
        },
        onSuccess(data) {
            toast.success('This product has been added to the cart.');
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'An error occurred, please try again.',
            );
        },
    });
    const handleAddToCart = (data) => {
        if (!userId) {
            router.push(routes.login);
        } else {
            createCartItemMutation.mutate(data);
            //add selected product to cartItem
            //add cartItem to cart
        }
    };
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(handleAddToCart)}
                className="flex flex-col gap-5">
                <Color colors={product?.colors} />
                <div className="flex gap-3">
                    <Quantity />
                    <button
                        type="submit"
                        disabled={
                            createCartItemMutation.isLoading ||
                            addToCartMutation.isLoading
                        }
                        className="bg-primary text-white font-medium rounded-md px-3 py-2 flex-1 relative overflow-hidden">
                        {createCartItemMutation.isLoading ||
                            (addToCartMutation.isLoading && (
                                <Loading sizeProp={20} colorProp={'white'} />
                            ))}
                        ADD TO CART
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default FormAddToCart;
