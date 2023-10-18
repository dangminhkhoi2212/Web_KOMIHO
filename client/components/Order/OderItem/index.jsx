import AvatarText from '@/components/Avatar';
import routes from '@/routes';
import clsx from 'clsx';
import { Badge } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { GrLocation } from 'react-icons/gr';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import PriceFormat from '@/components/PriceFormat';
const OrderItem = ({ orderItem }) => {
    const seller = orderItem._id.sellerId;
    const products = orderItem.products;
    const total = orderItem.total;

    return (
        <div className=" px-5 py-4 rounded-md  bg-white flex flex-col gap-5 relative">
            <div className="col-span-5 flex justify-between">
                <Link href={routes.store(seller?._id)}>
                    <AvatarText src={seller?.avatar?.url} name={seller?.name} />
                </Link>
                <div className="text-sm flex gap-5">
                    <div className="rounded-md bg-primary flex items-center">
                        <HiOutlineLocationMarker className="w-8 text-xl stroke-white" />
                    </div>
                    {seller?.address && (
                        <div className="flex flex-col text-md">
                            <p>{seller?.address?.store?.main}</p>
                            {seller?.address?.store?.sub && (
                                <p>{seller?.address?.store?.sub}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="ring-1 ring-gray-200 rounded-md">
                {products?.map(({ _id, productId, select }, index) => (
                    <div key={_id} className="relative">
                        <div className="grid grid-cols-12 rounded-md items-center p-5 place-items-center">
                            <Link
                                href={routes.productDetail(productId._id)}
                                className="col-span-4 place-self-start flex gap-3">
                                <div className="w-[80px] h-[80px] overflow-hidden ring-1 ring-gray-200 relative rounded-md">
                                    <Image
                                        src={productId?.images[0]?.url}
                                        alt={productId?.name}
                                        fill
                                        sizes="80px"
                                        className="object-contain object-center "
                                    />
                                </div>
                                <div className="text-sm line-clamp-3">
                                    {productId?.name}
                                </div>
                            </Link>
                            <div className="col-span-2 flex gap-3 justify-self-start text-xs">
                                <PriceFormat price={productId?.price} />
                            </div>
                            <div className="col-span-4 ">
                                <div className="flex  gap-5 text-sm ring-1 ring-gray-200 px-3 py-2 rounded-md ">
                                    {Object.keys(select).map((key, index) => (
                                        <span
                                            className="flex flex-col justify-center items-center gap-1"
                                            key={index}>
                                            <span className="font-semibold">
                                                {key[0].toLocaleUpperCase() +
                                                    key.slice(1)}
                                            </span>
                                            <span>{select[key]}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-1 text-xs font-bold">
                                <NumericFormat
                                    value={
                                        productId?.price?.final *
                                        select.quantity
                                    }
                                    thousandSeparator
                                    displayType="text"
                                    suffix={' VND'}
                                    renderText={(value) => (
                                        <span className="">{value}</span>
                                    )}
                                />
                            </div>
                        </div>
                        {index < products.length - 1 && <hr />}
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <div className=""></div>
                <div className="flex gap-2 ">
                    <span>Order Total ({products.length} item(s)): </span>
                    <NumericFormat
                        value={total}
                        thousandSeparator
                        displayType="text"
                        suffix={' VND'}
                        renderText={(value) => (
                            <span className="font-medium text-accent">
                                {value}
                            </span>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
