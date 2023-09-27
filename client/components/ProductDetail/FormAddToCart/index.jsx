import Color from '@/components/ProductDetail/FormAddToCart/Color';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { addToCartSchema } from '@/utils/validation';
import { toast } from 'react-toastify';
import Quantity from './Quantity';
const FormAddToCart = ({ colors }) => {
    const defaultValues = {
        color: '',
        size: '',
        quantity: 0,
    };
    const methods = useForm({
        defaultValues,
        resolver: yupResolver(addToCartSchema),
    });
    const {
        handleSubmit,
        formState: { errors },
    } = methods;
    console.log('🚀 ~ file: index.jsx:21 ~ FormAddToCart ~ errors:', errors);

    const addToCart = (data) => {
        console.log('🚀 ~ file: index.jsx:23 ~ addToCart ~ data:', data);

        return;
    };
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(addToCart)}
                className="flex flex-col gap-3">
                <Color colors={colors} />
                <Quantity />
                <button
                    type="submit"
                    className="bg-primary text-white font-medium rounded-md px-3 py-2">
                    ADD TO CART
                </button>
            </form>
        </FormProvider>
    );
};

export default FormAddToCart;
