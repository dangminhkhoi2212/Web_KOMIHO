'use client';
import routes from '@/routes';
import { formatPrice } from '@/utils/format';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';

const ProductCard = ({ product }) => {
    if (!product || !product.active) return <></>;
    return (
        <div className="overflow-hidden bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300 ease-in-out w-[200px] text-start">
            <Link
                href={routes.productDetail(product._id)}
                className="rounded-md bg-white relative ">
                {product?.price?.percent !== 0 && (
                    <span className="inline-block absolute top-0 z-container right-0 text-red-500  text-sm font-medium  bg-[#ffd839] px-2 py-1 rounded-bl-md">
                        {product?.price?.percent}% OFF
                    </span>
                )}
                <div className="relative h-[200px] w-[200px]">
                    <Image
                        src={product?.cover}
                        alt={product?.name}
                        fill={true}
                        priority
                        sizes="200px"
                        className="object-cover object-center"
                    />
                </div>
                <div className="grid grid-rows-5 p-2 text-sm  gap-1">
                    <div className="row-span-2 text-sm text-start ">
                        <span className="line-clamp-2 ">{product?.name}</span>
                    </div>
                    <div className="row-span-1 flex gap-1">
                        <Rating
                            SVGclassName="inline"
                            size={20}
                            allowFraction
                            initialValue={product?.ratingsAverage || 0}
                            readonly={true}
                        />
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
                    <div className="row-span-1 flex justify-between">
                        <span>{product?.sold} sold</span>
                        <span>{product?.views} views</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
