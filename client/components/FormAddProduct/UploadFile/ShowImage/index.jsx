import clsx from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';

const ShowImage = ({ gallery, callback }) => {
    const handleCallback = (name, src) => {
        if (callback) {
            callback(name, src);
        }
    };

    if (!gallery || gallery.length === 0) {
        return null; // Return early if there are no gallery
    }
    return (
        <div className="flex gap-4 w-full flex-wrap justify-start items-start my-3 ">
            {gallery.map((img, index) => {
                return (
                    <div className="flex flex-col items-center" key={img.name}>
                        <div
                            className={clsx(
                                'relative rounded-md overflow-hidden ring-2 ring-gray-100',
                                {
                                    'border-2 border-dashed border-accent':
                                        index === 0,
                                },
                            )}>
                            <TiDeleteOutline
                                className="absolute right-0 text-2xl text-white ring-1 m-2 cursor-pointer hover:bg-red-500 rounded-full"
                                onClick={() => {
                                    handleCallback(img.name, img.src);
                                }}
                            />
                            <Image
                                src={img.src}
                                width={0}
                                height={0}
                                alt={img.name}
                                loading="lazy"
                                className="rounded-md h-[200px] w-[200px]  object-center object-contain"
                            />
                        </div>
                        {index === 0 && (
                            <p className="font-medium text-forth">Cover</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ShowImage;
