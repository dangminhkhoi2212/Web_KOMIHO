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
import { removeChooseProduct } from '@/redux/chooseProductSlice';

const FormEditProduct = ({ product }) => {
    const listDeletedImages = useSelector(getListDeletedImages);

    const [initValue, setInitValue] = useState({
        originImages: product.images || [],
        images: product.images || [],
        name: product.name || '',
        price: product.price || {
            origin: '',
            percent: '',
            final: '',
        },
        colors: product.colors || [
            { name: '', sizes: [{ type: '', quantity: '' }] },
        ],
        tags: product.tags || '',
        description:
            EditorState.createWithContent(stateFromHTML(product.description)) ||
            EditorState.createWithContent(stateFromHTML('')),
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
        formState: { errors },
        handleSubmit,
        getValues,
    } = methods;

    const handleData = (data) => {
        if (data.description)
            data.description = draftToHtml(
                convertToRaw(data.description.getCurrentContent()),
            );

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
    const addProductMutation = useMutation({
        mutationFn: (data) => {
            const dataUpdate = handleData(data);

            return updateProduct(product._id, dataUpdate);
        },
        onSuccess(data) {
            if (data.ok) {
                handleDeleteImages();

                toast.success('Update successfully');

                queryClient.invalidateQueries(['products']);
                dispatch(removeChooseProduct());
                window.scrollTo(0, 0);
            }
        },
        onError(error) {
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
        var listDeleted = Array.from(listDeletedImages) || [];

        if (originImages.length)
            originImages.forEach((origin) => {
                const exist = images.find(
                    (img) => img.public_id === origin.public_id,
                );

                if (!exist) {
                    dispatch(addDeletedImages(origin));
                    listDeleted = [...listDeleted, origin];
                }
                //if old image don't exist in new images
                // put it into list deleted images
            });
        if (listDeletedImages.length)
            listDeletedImages.forEach((deletedImage) => {
                const exist = images.find(
                    (img) => img.public_id === deletedImage.public_id,
                );

                if (exist) {
                    dispatch(removeDeletedImages(deletedImage));
                    listDeleted = listDeleted.filter(
                        (img) => img.public_id !== deletedImage.public_id,
                    );
                }
                // if list deleted images exist in new images
                // remove it from list deleted images
            });

        deleteImagesMutation.mutate(listDeleted);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit((data) =>
                    addProductMutation.mutate(data),
                )}
                className="p-5 relative overflow-hidden rounded-md">
                {addProductMutation.isLoading && (
                    <Modal showModel={addProductMutation.isLoading}>
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

export default FormEditProduct;
