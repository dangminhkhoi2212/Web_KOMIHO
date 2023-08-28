'use client';

import { Carousel } from 'flowbite-react';
import { Flowbite } from 'flowbite-react';
import Image from 'next/image';
const CarouselImg = ({ images }) => {
    const costum = {
        carousel: {
            control: {
                base: 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary group-hover:bg-accent group-focus:outline-none group-focus:ring-4 group-focus:ring-backgroundColor dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10',
                icon: 'h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6',
            },
        },
    };
    if (!images || images.length == 0) return null;
    return (
        <Flowbite theme={{ theme: costum }}>
            <Carousel slideInterval={5000}>
                {images.map((img) => {
                    return (
                        <Image
                            key={img.src}
                            src={img.src}
                            width={0}
                            height={0}
                            alt={img.id}
                            className="rounded-md w-80 h-96"
                        />
                    );
                })}
            </Carousel>
        </Flowbite>
    );
};

export default CarouselImg;
