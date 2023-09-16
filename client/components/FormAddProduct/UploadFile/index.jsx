'use client';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ShowImage from './ShowImage';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Badge } from 'flowbite-react';
const Upload = ({ id = '', label = '', type, placeholder = '' }) => {
    const router = useRouter();

    const {
        register,
        control,
        formState: { errors },
        setValue,
    } = useFormContext();

    const images = useWatch({ control, name: 'images' });
    const gallery = useWatch({ control, name: 'gallery' });

    const handleChange = (e) => {
        const data = e.target.files;

        const existingImageNames = new Set(images.map((img) => img.name));

        for (let i = 0; i < data.length; i++) {
            if (images.length >= 9) break;
            if (!existingImageNames.has(data[i].name)) {
                const src = URL.createObjectURL(data[i]);
                const file = { name: data[i].name, src };
                images.push(data[i]);
                gallery.push(file);
            }
        }
        setValue('images', images);
        setValue('gallery', gallery);
    };

    // remove all local url  to improve performance
    const deleteURLImages = (e) => {
        e.preventDefault();
        if (gallery.length > 0)
            gallery.forEach((url) => URL.revokeObjectURL(url));
    };

    useEffect(() => {
        window.addEventListener('beforeunload', deleteURLImages);
        return () => {
            window.removeEventListener('beforeunload', deleteURLImages);
        };
    }, []);

    useEffect(() => {
        return () => {
            gallery.forEach((img) => URL.revokeObjectURL(img.src));
        };
    }, [router]);

    const handelDeleteImage = (name, src) => {
        URL.revokeObjectURL(src);
        setValue(
            'images',
            images.filter((img) => img.name !== name),
        );
        setValue(
            'gallery',
            gallery.filter((img) => img.name !== name),
        );
    };
    return (
        <div className=" bg-white rounded-xl ">
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
                        type={type}
                        id={id}
                        placeholder={placeholder}
                        {...register('images', {
                            onChange: (e) => {
                                handleChange(e);
                            },
                        })}
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
            <ShowImage
                gallery={gallery}
                callback={(name, src) => {
                    handelDeleteImage(name, src);
                }}
            />
        </div>
    );
};

export default Upload;
