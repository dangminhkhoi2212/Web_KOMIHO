import Loading from '@/components/Loading';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';

const ShowImage = ({ gallery = [], callback, isLoading }) => {
    const handleCallback = (img) => {
        if (callback) {
            callback(img);
        }
    };

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
                                onClick={() => {
                                    handleCallback(img);
                                }}
                            />
                            <Image
                                src={img.url}
                                fill={true}
                                alt={img.url}
                                loading="lazy"
                                sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px"
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
