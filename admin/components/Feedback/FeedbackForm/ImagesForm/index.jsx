import Loading from '@/components/Loading';
import { getUserId } from '@/redux/selector';
import { deleteImages, uploadImages } from '@/services/image.service';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AiOutlineCamera } from 'react-icons/ai';
import ProductImageCover from '@/components/ProductImageCover';
const ImagesForm = () => {
    const { setValue } = useFormContext();
    const userId = useSelector(getUserId);
    const images = useWatch({ name: 'images' });
    const [fileLength, setFileLength] = useState(0);
    const uploadMutation = useMutation({
        mutationFn: (data) => {
            return uploadImages(data);
        },
        onSuccess(data) {
            setFileLength((pre) => (pre !== 0 ? pre - data.length : 0));
            setValue('images', [...images, ...data]);
        },
    });
    const deleteImageMutation = useMutation({
        mutationFn: (image) => {
            return deleteImages([image]);
        },
    });
    const handleUpload = (e) => {
        const files = e.target.files;
        if (images.length + files.length > 5)
            return toast.warning('Maximum 5 photos');
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('images', files[i]);
        }

        const fileLengthTemp = data.getAll('images').length;

        if (fileLengthTemp) {
            setFileLength((pre) =>
                pre !== 0 ? pre + fileLengthTemp : fileLengthTemp,
            );
            data.append('userId', userId);
            for (let i of data) {
                console.log(i);
            }
            uploadMutation.mutate(data);
        }
    };
    const handleDeleteImage = (image) => {
        setValue(
            'images',
            images.filter((img) => img.public_id !== image.public_id),
        );
        deleteImageMutation.mutate(image);
    };
    return (
        <div className="flex gap-1 flex-wrap">
            {images.map((image, index) => (
                <ProductImageCover
                    allowDelete={true}
                    deleteImage={(img) => handleDeleteImage(img)}
                    image={image}
                    key={index}
                />
            ))}
            {Array(fileLength)
                .fill()
                .map((v, index) => (
                    <div
                        key={index}
                        className="rounded-md w-[80px] h-[80px] overflow-hidden relative ring-1 ring-gray-200">
                        <Loading sizeProp={20} />
                    </div>
                ))}

            <label
                role="button"
                className={clsx(
                    'rounded-md border-2 border-dashed   w-[80px] h-[80px]  justify-center items-center flex flex-col',
                    { 'cursor-not-allowed': images.length >= 5 },
                )}>
                <AiOutlineCamera className="text-3xl" />
                <p className="text-sm text-gray-400">{images.length}/5</p>
                <input
                    disabled={images.length >= 5}
                    type="file"
                    multiple
                    accept="jpg, jpeg, png"
                    max={5}
                    className="hidden"
                    onChange={handleUpload}
                />
            </label>
        </div>
    );
};

export default ImagesForm;
