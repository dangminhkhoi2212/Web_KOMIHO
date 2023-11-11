'use client';
import Color from '@/components/Product/FormAddToCart/Color';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { addToCartSchema } from '@/utils/validation';
import { toast } from 'react-toastify';
import Quantity from './Quantity';
import { useDispatch, useSelector } from 'react-redux';
import { setCartLength } from '@/redux/cartSlice';
import { getUserId } from '@/redux/selector';
import { useRouter } from 'next/navigation';
import routes from '@/routes';
import { useMutation } from '@tanstack/react-query';
import { addToCart } from '@/services/cart.service';
import Loading from '@/components/Loading';
import clsx from 'clsx';
const FormAddToCart = ({ product }) => {
    console.log('🚀 ~ file: index.jsx:19 ~ FormAddToCart ~ product:', product);
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
    useEffect(() => {
        toast.error(
            errors?.color?.message ||
                errors?.size?.message ||
                errors?.quantity?.message,
        );
    }, [errors]);

    const addToCartMutation = useMutation({
        mutationFn: (select) => {
            return addToCart({
                userId,
                sellerId: product.userId,
                productId: product._id,
                select,
            });
        },
        onSuccess(data) {
            dispatch(setCartLength({ cartLength: data.cartLength }));
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
            addToCartMutation.mutate(data);
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
                <div className="flex flex-col gap-3">
                    <div>
                        <Quantity />
                    </div>
                    <button
                        type="submit"
                        disabled={
                            addToCartMutation.isLoading ||
                            userId === product?.userId
                        }
                        className={clsx(
                            'bg-primary text-white font-medium rounded-md px-3 py-2 flex-1 relative overflow-hidden',
                            {
                                'cursor-not-allowed':
                                    userId === product?.userId,
                            },
                        )}>
                        {addToCartMutation.isLoading && (
                            <Loading sizeProp={20} colorProp={'white'} />
                        )}
                        ADD TO CART
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default FormAddToCart;
