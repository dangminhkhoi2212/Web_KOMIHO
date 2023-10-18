import PriceFormat from '@/components/PriceFormat';
import Image from 'next/image';
import Link from 'next/link';
import React, { memo } from 'react';
import { NumericFormat } from 'react-number-format';
import ProductImageCover from '@/components/ProductImageCover';
import routes from '@/routes';
const Product = ({ item }) => {
    return (
        <div className="grid grid-cols-12 gap-3 place-items-center">
            <div className="col-span-7 flex gap-2 place-self-start">
                <ProductImageCover image={item.product.images} />
                <div className="flex flex-col ">
                    <Link
                        href={routes.productDetail(item.product.productId)}
                        className="font-medium">
                        {item.product.name}
                    </Link>
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

export default memo(Product);
