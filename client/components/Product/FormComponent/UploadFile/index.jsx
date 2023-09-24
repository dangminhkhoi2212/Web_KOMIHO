'use client';
import { memo, useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ShowImage from './ShowImage';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Badge } from 'flowbite-react';
import { useMutation } from '@tanstack/react-query';
import { uploadImages, deleteImages } from '@/services/image.service';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllowDeletedImages,
    getListDeletedImages,
    getUserId,
} from '@/redux/selector';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import {
    addDeletedImages,
    removeDeletedImages,
    setAllowDeleted,
} from '@/redux/listDeletedImages';
const Upload = ({ id = '', label = '', placeholder = '' }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const userId = useSelector(getUserId);
    const {
        register,
        control,
        formState: { errors },
        setValue,
    } = useFormContext();

    const images = useWatch({ control, name: 'images' });
    console.log('🚀 ~ file: index.jsx:27 ~ Upload ~ images:', images);
    const [lengthFile, setLengthFile] = useState([]);
    const listDeletedImages = useSelector(getListDeletedImages);
    const allowDeleted = useSelector(getAllowDeletedImages);
    const upload = useMutation({
        mutationFn: (data) => {
            return uploadImages(data);
        },
        onSuccess(data) {
            data.forEach((img) => dispatch(addDeletedImages(img)));

            if (!allowDeleted) dispatch(setAllowDeleted(true));
            setValue('images', [...images, ...data]);
        },
        onError(error) {
            console.log('🚀 ~ file: index.jsx:34 ~ Upload ~ error:', error);
            toast.error('Can not upload this images. Please try again.');
        },
    });

    const handleChange = (e) => {
        const data = e.target.files;
        const length = data.length;
        const form = new FormData();
        var count = images.length;
        for (let i = 0; i < length; i++) {
            if (count > 9) return;
            count++;
            const file = data[i];

            form.append('images', file);
        }
        const lengthForm = form.getAll('images').length;
        if (lengthForm > 0) {
            form.append('userId', userId);
            upload.mutate(form);
            setLengthFile(Array(length).fill(0));
        }
    };

    return (
        <div className=" bg-white rounded-xl relative">
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
            <div className="flex gap-4 w-full flex-wrap justify-start items-start my-3 relative">
                <ShowImage gallery={images} />
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