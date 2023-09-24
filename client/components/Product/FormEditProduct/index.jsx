'use client';
import { useRef, useEffect, useState } from 'react';
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
import { getListDeletedImages, getUserId } from '@/redux/selector';

const InputCustom = dynamic(() => import('@/components/InputCustom'));
const Loading = dynamic(() => import('@/components/Loading'));
const UploadFile = dynamic(() =>
    import('@/components/Product/FormComponent/UploadFile'),
);
const Color = dynamic(() => import('@/components/Product/FormComponent/Color'));
const Description = dynamic(() =>
    import('@/components/Product/FormComponent/Description'),
);
const Price = dynamic(() => import('@/components/Product/FormComponent/Price'));
const Tag = dynamic(() => import('@/components/Product/FormComponent/Tag'));
const Name = dynamic(() => import('@/components/Product/FormComponent/Name'));
const Modal = dynamic(() => import('@/components/Modal'));

import { toast } from 'react-toastify';
import { images } from '@/next.config';
import { deleteImages } from '@/services/image.service';
import {
    addDeletedImages,
    removeDeletedImages,
    resetListDeletedImages,
} from '@/redux/listDeletedImages';

const FormAddProduct = ({ product }) => {
    const listDeletedImages = useSelector(getListDeletedImages);
    console.log(
        '🚀 ~ file: index.jsx:31 ~ FormAddProduct ~ listDeletedImages:',
        listDeletedImages,
    );
    const [initValue, setInitValue] = useState({
        originImages: product.images || [],
        images: product.images || [],
        name: product.name || '',
        price: product.price || {
            origin: '',
            percent: '',
            final: '',
        },
        color: product.color || [
            { name: '', size: [{ type: '', quantity: '' }] },
        ],
        tags: product.tags || '',
        description:
            EditorState.createWithContent(stateFromHTML(product.description)) ||
            '',
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
            dispatch(resetListDeletedImages());
            return deleteImages(images);
        },
        onSuccess() {
            console.log('DELETE');
            dispatch(resetListDeletedImages());
        },
    });
    const handleAddProduct = useMutation({
        mutationFn: (data) => {
            return updateProduct(product._id, handleData(data));
        },
        onSuccess(data) {
            if (data.ok) {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                handleDeleteImages();

                toast.success('Update successfully');

                queryClient.invalidateQueries(['products']);
            }
        },
        onError(error) {
            console.log('🚀 ~ file: index.jsx:97 ~ onError ~ error:', error);
            toast.error(
                'Update product failure. Please reload the page and try again',
            );
        },
    });
    //delete images don't use
    const handleDeleteImages = () => {
        const originImages = getValues('originImages');
        const images = getValues('images');
        // listDeleted use to save list deleted images while case list deleted images don't update in time
        var listDeleted = listDeletedImages || [];
        console.log(
            '🚀 ~ file: index.jsx:125 ~ handleDeleteImages ~ listDeleted:',
            listDeleted,
        );
        originImages.forEach((origin) => {
            const check = images.some(
                (img) => img.public_id !== origin.public_id,
            );
            //if old image don't exist in new images
            // put it into list deleted images
            if (!check) {
                dispatch(addDeletedImages(origin));
                listDeleted.push(origin);
            }
        });

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
                    <Description />
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
