'use client';
import { formatPrice } from '@/utils/format';
import clsx from 'clsx';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    if (!product) return;
    return (
        <div className="w-[200px] h-full rounded-md bg-white shadow-md hover:shadow-xl  transition-all duration-300 ease-in-out overflow-hidden relative">
            {product?.price?.percent !== 0 && (
                <span className="inline-block absolute top-0 z-container right-0 text-red-500  text-sm font-medium  bg-[#ffd839] px-2 py-1 rounded-bl-md">
                    {product?.price?.percent}% OFF
                </span>
            )}
            <div className="relative h-[200px] w-[200px]">
                <Image
                    src={product?.images[0]?.url}
                    alt={product?.name}
                    fill={true}
                    className="object-cover object-center"
                />
            </div>
            <div className="grid grid-rows-5 p-2 text-sm  gap-1">
                <div className="row-span-2 text-sm ">
                    <span className="line-clamp-2 ">{product?.name}</span>
                </div>
                <div className="row-span-1 flex gap-1">
                    {[...Array(5)].map((star, index) => (
                        <FaStar className="text-yellow-300" key={index} />
                    ))}
                </div>
                <div className="row-span-1 flex gap-3">
                    <span
                        className={clsx(
                            product.price.percent !== 0
                                ? 'line-through italic text-black'
                                : 'text-red-600 font-medium',
                        )}>
                        {formatPrice(product?.price?.origin)}
                    </span>
                    {product.price.percent !== 0 && (
                        <span className="text-red-600 font-medium">
                            {formatPrice(product.price.final)}
                        </span>
                    )}
                </div>
                <span>{product?.sold} sold</span>
            </div>
        </div>
    );
};

export default ProductCard;
