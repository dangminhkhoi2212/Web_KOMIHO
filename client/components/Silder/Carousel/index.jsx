'use client';

import { Carousel } from 'flowbite-react';
import { Flowbite } from 'flowbite-react';
const CarouselImg = () => {
    const costum = {
        carousel: {
            control: {
                base: 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary group-hover:bg-accent group-focus:outline-none group-focus:ring-4 group-focus:ring-backgroundColor dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10',
                icon: 'h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6',
            },
        },
    };
    return (
        <Flowbite theme={{ theme: costum }}>
            <Carousel slideInterval={5000}>
                <img
                    alt="1"
                    src="https://cdn2.yame.vn/pimg/ao-khoac-classic-y-nguyen-ban-18-ver48-0021327/eeb65e7f-6471-1100-b6f4-001a39386980.jpg?w=540&h=756&c=true"
                />
                <img
                    alt="2"
                    src="https://cdn2.yame.vn/pimg/quan-short-y1-m20-0022227/9e519752-0212-3e02-dae9-001a6e1a1224.jpg?w=540&h=756&c=true"
                />
                <img
                    alt="3"
                    src="https://cmsv2.yame.vn/uploads/41b364dc-84f8-4aac-8ffb-a2ce0f407dfc/THUMB1.jpg?quality=80&w=0&h=0"
                />
            </Carousel>
        </Flowbite>
    );
};

export default CarouselImg;
