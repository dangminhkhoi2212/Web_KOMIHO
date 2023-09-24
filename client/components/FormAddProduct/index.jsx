'use client';
import { useRef, useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic';
import { addProductSchema } from '@/utils/validation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addProduct } from '@/services/product.service';
import { useDispatch, useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';

const InputCustom = dynamic(() => import('@/components/InputCustom'));
const Loading = dynamic(() => import('@/components/Loading'));
const UploadFile = dynamic(() => import('./UploadFile'));
const Color = dynamic(() => import('./Color'));
const Description = dynamic(() => import('./Description'));
const Price = dynamic(() => import('./Price'));
const Tag = dynamic(() => import('./Tag'));
const Modal = dynamic(() => import('@/components/Modal'));

import { toast } from 'react-toastify';
export const initValue = {
    images: [],
    gallery: [],
    name: '',
    price: {
        origin: '',
        percent: '',
        final: '',
    },
    color: [{ name: '', size: [{ type: '', quantity: '' }] }],
    tags: '',
    description: '',
};
const FormAddProduct = () => {
    const userId = useSelector(getUserId);

    const methods = useForm({
        resolver: yupResolver(addProductSchema),
        defaultValues: initValue,
    });

    const {
        control,
        getValues,
        reset,
        formState: { errors },
        handleSubmit,
    } = methods;

    const createFormData = (data) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('name', data.name.trim());

        formData.append('price', JSON.stringify(data.price));
        formData.append('color', JSON.stringify(data.color));
        formData.append('tags', data.tags);
        formData.append('images', JSON.stringify(data.images));

        if (data.description)
            formData.append(
                'description',
                draftToHtml(convertToRaw(data.description.getCurrentContent())),
            );

        let store = 0;
        data.color.forEach((color) => {
            color.size.forEach((size) => {
                store += Number(size.quantity);
            });
        });
        formData.append('store', store);
        return formData;
    };

    const handleAddProduct = useMutation({
        mutationFn: async (data) => {
            const formData = createFormData(data);

            for (let file of formData) {
                console.log(file);
            }
            return await addProduct(formData);
        },
        onSuccess(data) {
            if (data.status === 'success') {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                toast.success('Added new product successfully');
                reset(initValue);
            }
        },
        onError(error) {
            toast.error(
                'Add new product failure. Please reload the page and try again',
            );
        },
    });

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit((data) => handleAddProduct.mutate(data))}
                className="p-5 relative overflow-hidden rounded-md">
                {handleAddProduct.isLoading && (
                    <Modal showModel={handleAddProduct.isLoading}>
                        <div className="w-20 h-20 flex flex-col justify-center items-center">
                            <Loading sizeProp={80} />
                        </div>
                        <p className="text-center mt-8">
                            The upload process can take a few minutes...
                        </p>
                    </Modal>
                )}
                <div className="flex flex-col gap-6">
                    <UploadFile id={'upload-image'} label="Upload Images" />
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <InputCustom
                                id={'name'}
                                label={'Name '}
                                type={'text'}
                                placeholder={'Product Name '}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                value={field.value}
                                helperText={errors.name?.message}
                                color={
                                    errors.name?.message ? 'failure' : 'gray'
                                }
                            />
                        )}
                    />
                    <Price />
                    <Color />

                    <Tag />
                    <Description />
                </div>
                <button
                    type="submit"
                    className="h-12 w-16 mt-3 transition ease-in-out  overflow-hidden hover:bg-accent duration-500  cursor-pointer p-3 rounded-xl bg-primary shadow-sm shadow-accent font-bold text-white relative align-bottom float-right">
                    Add
                </button>
            </form>
        </FormProvider>
    );
};

export default FormAddProduct;
