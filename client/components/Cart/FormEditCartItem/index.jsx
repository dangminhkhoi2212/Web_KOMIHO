'use client';
import Color from '@/components/Cart/FormEditCartItem/Color';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { addToCartSchema } from '@/utils/validation';
import { toast } from 'react-toastify';
import Quantity from '@/components/Cart/FormEditCartItem/Quantity';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCartItem } from '@/services/cartItem.service';

import { resetCartItem } from '@/redux/cartItem';
import { getCartItemId, getSelectCartItem } from '@/redux/selector';
import { updateSelectOneCartItem } from '@/redux/selectProductInCart';
const FormAddToCart = ({ product }) => {
    const cartItemId = useSelector(getCartItemId);
    const select = useSelector(getSelectCartItem);
    const defaultValues = {
        colors: product?.colors,
        size: select?.size,
        color: select?.color,
        quantity: select?.quantity,
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
    const queryClient = useQueryClient();
    useEffect(() => {
        toast.error(
            errors?.color?.message ||
                errors?.size?.message ||
                errors?.quantity?.message,
        );
    }, [errors]);

    const updateCartItemMutation = useMutation({
        mutationFn: (select) => {
            const data = { cartItemId, select };

            return updateCartItem(data);
        },
        onSuccess(data) {
            queryClient.invalidateQueries(['carts']);
            dispatch(resetCartItem());
            dispatch(updateSelectOneCartItem(data));
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'Update error. Please try again.',
            );
        },
    });

    const handleUpdateCartItem = (data) => {
        const select = {
            color: data.color,
            size: data.size,
            quantity: data.quantity,
        };

        updateCartItemMutation.mutate(select);
    };
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(handleUpdateCartItem)}
                className="flex flex-col gap-5">
                <Color colors={product?.colors} />
                <div className="flex gap-3">
                    <Quantity />
                    <button
                        type="submit"
                        className="bg-primary text-white font-medium rounded-md px-3 py-2 flex-1">
                        Save
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default FormAddToCart;
