const Loading = dynamic(() => import('@/components/Loading'));
import {
    addDeletedImages,
    removeDeletedImages,
    setAllowDeleted,
} from '@/redux/listDeletedImages';
import { getAllowDeletedImages } from '@/redux/selector';
import { deleteImages } from '@/services/image.service';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

const ShowImage = ({ gallery = [] }) => {
    const allowDeleted = useSelector(getAllowDeletedImages);

    const dispatch = useDispatch();
    const { control, setValue } = useFormContext();

    const images = useWatch({ control, name: 'images' });
    const originImages = useWatch({ control, name: 'originImages' });

    const [deletedImage, setDeletedImage] = useState({});
    const deleteImagesMutation = useMutation({
        mutationFn: (images) => {
            return deleteImages(images);
        },
        onSuccess() {
            dispatch(removeDeletedImages(deletedImage));
            setValue(
                'images',
                images.filter(
                    (image) => image.public_id !== deletedImage?.public_id,
                ),
            );
        },
    });

    useEffect(() => {
        setValue(
            'images',
            images.filter(
                (image) => image.public_id !== deletedImage?.public_id,
            ),
        );
        dispatch(addDeletedImages(deletedImage));
    }, [deletedImage]);

    if (!gallery || gallery.length === 0) {
        return null; // Return early if there are no gallery
    }
    return (
        <>
            {gallery.map((img, index) => {
                return (
                    <div
                        className="flex flex-col items-center relative"
                        key={img.public_id}>
                        {deleteImagesMutation.isLoading &&
                            deletedImage?.public_id == img.public_id && (
                                <Loading sizeProp={50} />
                            )}
                        <div
                            className={clsx(
                                'relative rounded-md overflow-hidden ring-2 ring-gray-100 h-[200px] w-[200px]',
                                {
                                    'border-2 border-dashed border-accent':
                                        index === 0,
                                },
                            )}>
                            <TiDeleteOutline
                                className="absolute right-0 text-2xl z-[2] text-white ring-1 m-2 cursor-pointer hover:bg-red-500 rounded-full"
                                onClick={() => setDeletedImage(img)}
                            />
                            <Image
                                src={img.url}
                                fill
                                alt={img.url}
                                sizes="200px"
                                className="rounded-md z-[1]  object-center object-contain"
                            />
                        </div>
                        {index === 0 && (
                            <p className="font-medium text-forth">Cover</p>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default ShowImage;
