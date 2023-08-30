import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ShowImage from './ShowImage';
const InputCostum = ({
    id = '',
    label = '',
    type,
    placeholder = '',
    register,
}) => {
    const input = useRef(null);
    const [images, setImages] = useState([]);
    const handleChooseFile = () => {
        input.current.click();
    };
    const handleChange = (e) => {
        const data = e.target.files;
        console.log(
            '🚀 ~ file: UploadFile.jsx:19 ~ handleChange ~ data:',
            data,
        );
        const listImg = Array.from(data);

        const result = listImg.map((file) => {
            return {
                id: file.name,
                src: URL.createObjectURL(file),
            };
        });
        setImages((pre) => [...pre, ...result]);
        return () => {
            if (images.length > 0) {
                images.forEach((image) => URL.revokeObjectURL(image.src));
            }
        };
    };
    return (
        <div className="p-5 bg-white rounded-xl">
            <label
                htmlFor={id}
                className="inline-block mb-3 text-lg font-medium ">
                {label}
            </label>
            <div
                className="h-40 w-52 cursor-pointer flex flex-col justify-center items-center rounded-lg border border-dashed border-slate-700"
                onClick={handleChooseFile}>
                <AiOutlineCloudUpload className="text-4xl" />
                <span>Type is jpg or png.</span>
            </div>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                {...register}
                className="hidden"
                ref={input}
                multiple
                accept="image/png, image/jpeg"
                onChange={handleChange}
            />
            <ShowImage images={images} setImages={setImages} />
        </div>
    );
};

export default InputCostum;
