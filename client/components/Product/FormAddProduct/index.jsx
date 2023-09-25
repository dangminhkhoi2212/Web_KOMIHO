'use client';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { stateFromHTML } from 'draft-js-import-html';
import dynamic from 'next/dynamic';
import { addProductSchema } from '@/utils/validation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addProduct, updateProduct } from '@/services/product.service';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllowDeletedImages,
    getListDeletedImages,
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
import { images } from '@/next.config';
import { deleteImages } from '@/services/image.service';
import {
    addDeletedImages,
    removeDeletedImages,
    resetListDeletedImages,
} from '@/redux/listDeletedImages';

const FormAddProduct = () => {
    const listDeletedImages = useSelector(getListDeletedImages);
    const userId = useSelector(getUserId);
    const [initValue, setInitValue] = useState({
        userId,
        originImages: [],
        images: [],
        name: '',
        price: {
            origin: '',
            percent: '',
            final: '',
        },
        color: [{ name: '', size: [{ type: '', quantity: '' }] }],
        tags: '',
        store: 0,
        description: EditorState.createEmpty(),
    });
    useEffect(() => {
        dispatch(resetListDeletedImages());
    }, []);
    const methods = useForm({
        resolver: yupResolver(addProductSchema),
        defaultValues: initValue,
    });
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const {
        control,
        getValues,
        reset,
        formState: { errors },
        handleSubmit,
    } = methods;

    // console.log('🚀 ~ file: index.jsx:67 ~ FormAddProduct ~ errors:', errors);

    const handleData = (data) => {
        if (data.description)
            data.description = draftToHtml(
                convertToRaw(data.description.getCurrentContent()),
            );

        data.color.forEach((color) => {
            color.size.forEach((size) => {
                data.store += Number(size.quantity);
            });
        });

        return data;
    };

    const deleteImagesMutation = useMutation({
        mutationFn: (images) => {
            return deleteImages(images);
        },
        onSuccess() {
            console.log('DELETE 2');
            dispatch(resetListDeletedImages());
        },
    });
    const handleAddProduct = useMutation({
        mutationFn: (data) => {
            return addProduct(handleData(data));
        },
        onSuccess(data) {
            if (data.ok) {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                handleDeleteImages();
                reset(initValue);
                toast.success('Add product successfully');

                queryClient.invalidateQueries(['products']);
            }
        },
        onError(error) {
            console.log('🚀 ~ file: index.jsx:97 ~ onError ~ error:', error);
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
                const check = images.some(
                    (img) => img.public_id !== origin.public_id,
                );
                //if old image don't exist in new images
                // put it into list deleted images
                console.log(
                    '🚀 ~ file: index.jsx:144 ~ originImages.forEach ~ check:',
                    check,
                );
                if (!check) {
                    dispatch(addDeletedImages(origin));
                    listDeleted = [...listDeleted, origin];
                }
            });
        if (listDeletedImages.length)
            listDeletedImages.forEach((deletedImage) => {
                const check = images.some(
                    (img) => img.public_id === deletedImage.public_id,
                );
                // if list deleted images exist in new images
                // remove it from list deleted images
                if (check) {
                    dispatch(removeDeletedImages(deletedImage));
                    listDeleted = listDeleted.filter(
                        (img) => img.public_id !== deletedImage.public_id,
                    );
                }
            });

        deleteImagesMutation.mutate(listDeleted);
    };
    const allowDeleted = useSelector(getAllowDeletedImages);

    window.onbeforeunload = () => {
        if (allowDeleted) {
            deleteImagesMutation.mutate(listDeletedImages);
        }
    };
    useEffect(() => {
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

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
                    </Modal>
                )}
                <div className="flex flex-col gap-6">
                    <UploadFile id={'upload-image'} label="Upload Images" />

                    <Name />
                    <Price />
                    <Color />

                    <Tag />
                    {Description && <Description />}
                </div>
                <button
                    type="submit"
                    className="h-12 w-16 mt-3 transition ease-in-out  overflow-hidden hover:bg-accent duration-500  cursor-pointer p-3 rounded-xl bg-primary shadow-sm shadow-accent font-bold text-white relative align-bottom float-right">
                    Save
                </button>
            </form>
        </FormProvider>
    );
};

export default FormAddProduct;
