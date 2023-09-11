'use client';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import InputCustom from '@/components/InputCustom';
import Loading from '@/components/Loading';
import { addProductSchema } from '@/utils/validation';
import { useRef, useEffect, useState } from 'react';
import UploadFile from './UploadFile';
import Color from './Color';
import Description from './Description';
import Price from './Price';
import { addProduct } from '@/services/product.service';
import { useDispatch, useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import { setAlert } from '../Alert/alertSlice';
import Type from './Type';
import Tag from './Tag';
import { current } from '@reduxjs/toolkit';
import { useMutation, useQuery } from '@tanstack/react-query';
import Modal from '../Modal';
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
    type: '',
    tags: '',
    description: '',
};
const FormAddProduct = () => {
    const userId = useSelector(getUserId);

    const methods = useForm({
        resolver: yupResolver(addProductSchema),
        defaultValues: initValue,
    });

    const scrollRef = useRef();

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
        formData.append('type', data.type);
        formData.append('tags', data.tags);
        if (data.description)
            formData.append(
                'description',
                draftToHtml(convertToRaw(data.description.getCurrentContent())),
            );
        if (data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }
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
                scrollRef.current?.scrollTo({
                    y: 0,
                    animated: true,
                });
                toast.success('Added new product successfully');
                reset(initValue);
                const gallery = getValues('gallery');
                gallery.forEach((img) => URL.revokeObjectURL(img.src));
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
                className="p-5 relative overflow-hidden rounded-md"
                ref={scrollRef}>
                {handleAddProduct.isLoading && (
                    <Modal showModel={handleAddProduct.isLoading}>
                        <div className="w-20 h-20 flex flex-col justify-center items-center">
                            <Loading />
                        </div>
                        <p className="text-center mt-8">
                            Please wait several minute...
                        </p>
                    </Modal>
                )}
                <div className="flex flex-col gap-6">
                    <UploadFile
                        id={'upload-image'}
                        type={'file'}
                        label="Upload Images"
                    />
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
                    <div className="grid grid-cols-5">
                        <div className="col-span-2">
                            <Type />
                        </div>
                        <div className="col-span-3">
                            <Tag />
                        </div>
                    </div>
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
