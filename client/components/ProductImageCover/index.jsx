'use client';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
const ImageIconProduct = ({
    image,
    allowDelete = false,
    allowView = true,
    deleteImage,
}) => {
    const [viewImage, setViewImage] = useState(false);
    const handleDeleteImage = () => {
        if (deleteImage) deleteImage(image);
    };
    if (!Object.keys(image).length) return <></>;
    return (
        <div className="w-[80px] h-[80px] rounded-md overflow-hidden ring-1 ring-gray-200 relative group">
            <Image
                src={image?.url}
                alt={image?.url}
                fill
                sizes="80px"
                className="object-contain object-center"
            />
            {viewImage && (
                <Modal
                    handleEvent={() => setViewImage(false)}
                    size="xl"
                    label={'VIEW'}>
                    <div className="flex justify-center items-center">
                        <div className="w-[300px] h-[300px] rounded-md overflow-hidden ring-1 ring-gray-200 relative">
                            <Image
                                src={image?.url}
                                alt={image?.url}
                                fill
                                sizes="300px"
                                className="object-contain object-center"
                            />
                        </div>
                    </div>
                </Modal>
            )}
            <div className="translate-y-[101%] group-hover:translate-y-[2px] absolute inset-x-0 bottom-0 flex justify-center gap-2 items-center backdrop-brightness-50 transition-all duration-150 ease-in-out  text-white">
                {allowView && (
                    <AiOutlineEye
                        className="text-3xl py-1 cursor-pointer"
                        onClick={() => setViewImage(true)}
                    />
                )}
                {allowDelete && (
                    <>
                        <div className="w-[1px] h-5 bg-white"></div>

                        <RiDeleteBin6Line
                            className="text-3xl py-1 cursor-pointer"
                            onClick={() => {
                                handleDeleteImage();
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageIconProduct;
