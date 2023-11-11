'use client';
import React, { Component } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Image from 'next/image';
import NextArrow from './NextArrow';
import PreviousArrow from './PreviousArrow';

const CenterMode = ({ images }) => {
    if (!images?.length) return;
    const settings = {
        customPaging: function (i) {
            const img = images.find((img, index) => index === i);
            return (
                <div className="w-[80px] h-[80px]  relative hover:ring-1 hover:ring-accent rounded-md overflow-hidden">
                    <Image
                        src={img?.url}
                        alt={img?.url}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                    />
                </div>
            );
        },
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        speed: 500,
        fade: true,
        lazyLoad: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PreviousArrow />,
    };
    return (
        <Slider {...settings}>
            {images.map((img) => (
                <div key={img.url} className="w-[350px] h-[350px] relative">
                    <Image
                        src={img.url}
                        alt={img.url}
                        priority
                        fill
                        sizes="350px"
                        className="object-contain object-center"
                    />
                </div>
            ))}
        </Slider>
    );
};
export default CenterMode;
