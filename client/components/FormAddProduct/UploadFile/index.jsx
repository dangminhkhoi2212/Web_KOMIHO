import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ShowImage from './ShowImage';
import { useFormContext } from 'react-hook-form';
const Upload = ({ id = '', label = '', type, placeholder = '' }) => {
    const {
        register,
        control,
        formState: { errors },
        getValues,
        setValue,
    } = useFormContext();
    const [images, setImages] = useState([]);
    const [gallery, setGallery] = useState([]);
    console.log('🚀 ~ file: index.jsx:15 ~ Upload ~ gallery:', gallery);

    console.log('🚀 ~ file: index.jsx:28 ~ handleChange ~ images:', images);
    const handleChange = (e) => {
        const data = e.target.files;

        for (let i = 0; i < data.length; i++) {
            if (!images.some((img) => img.name === data[i].name)) {
                const src = URL.createObjectURL(data[i]);
                const file = { name: data[i].name, src };
                setImages((pre) => [...pre, data[i]]);
                setGallery((pre) => [...pre, file]);
            }
        }

        // const listImg = Array.from(data);
        // console.log(
        //     '🚀 ~ file: index.jsx:18 ~ handleChange ~ listImg:',
        //     listImg,
        // );

        // const result = listImg.map((file) => {
        //     console.log('🚀 ~ file: index.jsx:21 ~ result ~ file:', file);
        //     return {
        //         file,
        //         src: URL.createObjectURL(file),
        //     };
        // });
        // setImages((pre) => [...pre, ...result]);
        // return () => {
        //     if (images.length > 0) {
        //         images.forEach((image) => URL.revokeObjectURL(image.src));
        //     }
        // };
    };
    // useEffect(() => {
    //     images.forEach((image) => {
    //         if (!gallery.some((gal) => gal === image.name)) {
    //             const src = URL.createObjectURL(image);
    //             const file = { name: image.name, src };
    //             setGallery((pre) => [...pre, file]);
    //         }
    //     });

    //     return () => {
    //         if (gallery.length) {
    //             gallery.forEach((gal) => URL.revokeObjectURL(gal.src));
    //         }
    //     };
    // }, [images]);
    return (
        <div className=" bg-white rounded-xl ">
            <label
                htmlFor={id}
                className="inline-block mb-3 text-lg font-medium ">
                {label}
            </label>
            <label
                htmlFor={id}
                className="max-w-[180px] p-3 cursor-pointer flex flex-col justify-center items-center rounded-lg border border-dashed border-slate-700">
                <AiOutlineCloudUpload className="text-4xl" />
                <span>Type is jpg or png.</span>
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
            <ShowImage
                gallery={gallery}
                setGallery={setGallery}
                setImages={setImages}
            />
        </div>
    );
};

export default Upload;
