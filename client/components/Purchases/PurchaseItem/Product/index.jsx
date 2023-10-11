import PriceFormat from '@/components/PriceFormat';
import Image from 'next/image';
import React from 'react';
import { NumericFormat } from 'react-number-format';

const Product = ({ item }) => {
    console.log('🚀 ~ file: index.jsx:5 ~ Product ~ item:', item);
    return (
        <div className="grid grid-cols-12 gap-3 place-items-center">
            <div className="col-span-7 flex gap-2 place-self-start">
                <div className="w-[80px] h-[80px] relative rounded-md overflow-hidden ring-1 ring-gray-200">
                    <Image
                        src={item.product.images.url}
                        alt={item.product.images.url}
                        fill
                        sizes="80px"
                        className="object-center object-contain"
                    />
                </div>
                <div className="flex flex-col ">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-500">{`${item.select.color}, ${item.select.size}`}</p>
                </div>
            </div>
            <div className="col-span-2">
                <PriceFormat price={item.product.price} />
            </div>
            <div className="col-span-1">
                <p className="font-medium">x{item.select.quantity}</p>
            </div>
            <div className="col-span-2">
                <NumericFormat
                    value={item.product.price.final * item.select.quantity}
                    thousandSeparator
                    displayType="text"
                    suffix={' VND'}
                    renderText={(value) => (
                        <span className="font-medium">{value}</span>
                    )}
                />
            </div>
        </div>
    );
};

export default Product;
