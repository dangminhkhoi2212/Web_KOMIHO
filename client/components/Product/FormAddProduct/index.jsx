'use client';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { addProductSchema } from '@/utils/validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct } from '@/services/product.service';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllowDeletedImages,
    getListDeletedImages,
    getStoreAddress,
    getUserId,
} from '@/redux/selector';

import Loading from '@/components/Loading';
import UploadFile from '@/components/Product/FormComponent/UploadFile';
import Color from '@/components/Product/FormComponent/Color';
import Description from '@/components/Product/FormComponent/Description';
import Price from '@/components/Product/FormComponent/Price';
import Tag from '@/components/Product/FormComponent/Tag';
import Name from '@/components/Product/FormComponent/Name';
import Modal from '@/components/Modal';

import { toast } from 'react-toastify';
import { deleteImages } from '@/services/image.service';
import {
    addDeletedImages,
    removeDeletedImages,
    resetListDeletedImages,
} from '@/redux/listDeletedImages';
import { useRouter } from 'next/navigation';
import routes from '@/routes';
import { Button } from '@/components/ui/button';
const initValue = {
    originImages: [],
    images: [],
    name: '',
    price: {
        origin: '',
        percent: '',
        final: '',
    },
    colors: [{ name: '', sizes: [{ type: '', quantity: '' }] }],
    tags: '',
    description: EditorState.createEmpty(),
};
const FormAddProduct = () => {
    const listDeletedImages = useSelector(getListDeletedImages);
    const userId = useSelector(getUserId);
    const storeAddress = useSelector(getStoreAddress);
    const router = useRouter();
    useEffect(() => {
        dispatch(resetListDeletedImages());
    }, []);
    const methods = useForm({
        resolver: yupResolver(addProductSchema),
        defaultValues: initValue,
    });
    const dispatch = useDispatch();
    const {
        control,
        getValues,
        reset,
        resetField,
        formState: { errors },
        handleSubmit,
    } = methods;

    const handleData = (data) => {
        data.userId = userId;
        if (data.description)
            data.description = draftToHtml(
                convertToRaw(data.description.getCurrentContent()),
            );

        return data;
    };

    const deleteImagesMutation = useMutation({
        mutationFn: (images) => {
            return deleteImages(images);
        },
        onSuccess() {
            dispatch(resetListDeletedImages());
        },
    });
    const handleAddProduct = useMutation({
        mutationFn: (data) => {
            return addProduct(handleData(data));
        },
        onSuccess(data) {
            if (typeof window !== 'undefined')
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            if (data.ok) {
                handleDeleteImages();
                const colors = getValues('colors');
                colors.forEach((_, index) => {
                    resetField(`colors.${index}`);
                });
                reset(initValue);
                resetField('colors');
                toast.success('Add product successfully');
                router.push(routes.managerAddProduct);
            }
        },
        onError(error) {
            toast.error(
                'Add product failure. Please reload the page and try again',
            );
        },
    });
    //delete images don't use
    const handleDeleteImages = () => {
        const originImages = getValues('originImages');
        const images = getValues('images');
        // listDeleted use to save list deleted images while case list deleted images don't update in time
        var listDeleted = Array.from(listDeletedImages) || [];

        if (originImages.length)
            originImages.forEach((origin) => {
                images.forEach((img) => {
                    if (img.public_id !== origin.public_id) {
                        dispatch(addDeletedImages(origin));
                        listDeleted = [...listDeleted, origin];
                    }
                });

                //if old image don't exist in new images
                // put it into list deleted images
            });
        if (listDeletedImages.length)
            listDeletedImages.forEach((deletedImage) => {
                images.forEach((img) => {
                    if (img.public_id === deletedImage.public_id) {
                        dispatch(removeDeletedImages(deletedImage));
                        listDeleted = listDeleted.filter(
                            (img) => img.public_id !== deletedImage.public_id,
                        );
                    }
                });

                // if list deleted images exist in new images
                // remove it from list deleted images
            });

        deleteImagesMutation.mutate(listDeleted);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit((data) => handleAddProduct.mutate(data))}
                className="p-5 relative overflow-hidden rounded-md">
                {!storeAddress && (
                    <Modal
                        handleEvent={() => {
                            router.push(routes.address);
                        }}
                        label={'UPDATE STORE ADDRESS'}>
                        <div>
                            <p>
                                You don't have a store address yet. Please add
                                your store address.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button
                                    className=""
                                    onClick={() => {
                                        router.push(routes.address);
                                    }}>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
                {handleAddProduct.isLoading && (
                    <Modal showModel={handleAddProduct.isLoading}>
                        <div className="w-20 h-20 flex flex-col justify-center items-center">
                            <Loading sizeProp={80} />
                        </div>
                    </Modal>
                )}
                <div className="flex flex-col gap-6">
                    <UploadFile id={'upload-image'} label="Upload Images" />

                    <Name />
                    <Price />
                    <Color control={control} />

                    <Tag />
                    {Description && <Description />}
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
