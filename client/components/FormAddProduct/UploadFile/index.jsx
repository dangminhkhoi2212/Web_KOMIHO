'use client';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ShowImage from './ShowImage';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Badge } from 'flowbite-react';
import { useMutation } from '@tanstack/react-query';
import { uploadImages, deleteImages } from '@/services/image.service';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
const Upload = ({ id = '', label = '', placeholder = '' }) => {
    const router = useRouter();
    const userId = useSelector(getUserId);
    const {
        register,
        control,
        formState: { errors },
        setValue,
    } = useFormContext();

    const images = useWatch({ control, name: 'images' });
    const [showModal, setShowModal] = useState(false);
    const [lengthFile, setLengthFile] = useState([]);
    const upload = useMutation({
        mutationFn: (data) => {
            return uploadImages(data);
        },
        onSuccess(data) {
            setValue('images', [...images, ...data]);
        },
        onError(error) {
            console.log('🚀 ~ file: index.jsx:34 ~ Upload ~ error:', error);
            toast.error('Can not upload this images. Please try again.');
        },
    });

    const handleChange = (e) => {
        const data = e.target.files;
        console.log('🚀 ~ file: index.jsx:45 ~ handleChange ~ data:', data);
        const length = data.length;
        const form = new FormData();
        var count = images.length;
        for (let i = 0; i < length; i++) {
            console.log(
                '🚀 ~ file: index.jsx:48 ~ handleChange ~ count:',
                count,
            );
            if (count > 9) return;
            const file = data[i];
            count++;
            form.append('images', file);
        }
        form.append('userId', userId);

        upload.mutate(form);

        setLengthFile(Array(length).fill(0));
    };

    // remove all local url  to improve performance

    const handleDeleteImages = useMutation({
        mutationFn: (images) => {
            return deleteImages(images);
        },
        onSuccess(data) {
            if (data.ok) {
                const oldImages = data.images;
                const newImages = images.filter((img) => {
                    return oldImages.some(
                        (oldImg) => oldImg.public_id !== img.public_id,
                    );
                });
                console.log(
                    '🚀 ~ file: index.jsx:93 ~ newImages ~ newImages:',
                    newImages,
                );

                setValue('images', newImages);
            }
        },
    });

    // useEffect(() => {
    //     const handleReload = (e) => {
    //         e.preventDefault();
    //         setShowModal(true);
    //         return (e.returnValue = '');
    //     };
    //     window.addEventListener('beforeunload', handleReload);
    //     return () => {
    //         if (images.length > 0) handleDeleteImages.mutate(images);
    //         console.log('out');
    //         window.removeEventListener('beforeunload', handleReload);
    //     };
    // }, []);

    const handelDeleteOneImage = (img) => {
        handleDeleteImages.mutate([img]);
    };

    return (
        <div className=" bg-white rounded-xl relative">
            {handleDeleteImages.isLoading && <Loading />}
            {showModal && <Modal>Do you want to leave this page?</Modal>}
            <div className="grid grid-cols-4 w-full">
                <div className="col-span-1">
                    <label
                        htmlFor={id}
                        className="inline-block mb-3 text-lg font-medium ">
                        {label}
                    </label>
                    <label
                        htmlFor={id}
                        className="max-w-[180px] p-3 cursor-pointer flex flex-col justify-center items-center rounded-lg border border-dashed border-slate-700 text-sm">
                        <AiOutlineCloudUpload className="text-4xl" />
                        <span>Type is jpg or png.</span>
                        <span>Maximum 9 photos.</span>
                    </label>
                    <input
                        type="file"
                        id={id}
                        placeholder={placeholder}
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        className="hidden"
                        multiple
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <span className="text-sm text-red-600">
                        {errors?.images?.message}
                    </span>
                </div>
                <div className="col-span-3 ms-3 flex flex-col gap-2 justify-center items-start">
                    <Badge color="pink">
                        <b>Note:</b> The first image will use as the cover
                        photo.
                    </Badge>

                    <Badge color="info">
                        <b>Recommend:</b> You should choose photo with a 1:1
                        ratio
                    </Badge>
                </div>
            </div>
            <div className="flex gap-4 w-full flex-wrap justify-start items-start my-3 ">
                <ShowImage
                    gallery={images}
                    callback={(img) => {
                        handelDeleteOneImage(img);
                    }}
                />
                {upload.isLoading &&
                    lengthFile.map((_, index) => (
                        <div
                            key={index}
                            className="h-[200px] w-[200px] rounded-md bg-slate-100 relative">
                            {upload.isLoading && <Loading sizeProp={50} />}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Upload;
