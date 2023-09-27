'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Carousel from '@/components/ProductDetail/Carousel';
import Loading from '@/components/Loading';
import { getProductByProductId } from '@/services/product.service';
import Price from '@/components/ProductDetail/Price';
import { AiOutlineEye } from 'react-icons/ai';
import FormAddToCart from '@/components/ProductDetail/FormAddToCart';

const Detail = ({ params }) => {
    const [product, setProduct] = useState(null);
    const getProductQuery = useQuery({
        queryKey: ['get-detail-product'],
        queryFn: () => {
            return getProductByProductId(params.productId);
        },
    });
    useEffect(() => {
        setProduct(getProductQuery?.data);
    }, [getProductQuery?.data]);

    return (
        <div>
            {getProductQuery.isLoading && <Loading />}
            <div className="grid grid-cols-12 px-20 py-10 bg-white rounded-md gap-5">
                <div className="col-span-4 mx-6 py-3">
                    <Carousel images={product?.images} />
                </div>
                <div className="col-span-8 p-10 flex gap-3 flex-col">
                    <h1 className="text-2xl ">{product?.name}</h1>
                    <Price price={product?.price} />
                    <div className="flex gap-3 items-center">
                        <AiOutlineEye className="text-lg" />
                        {product?.views} views
                    </div>
                    <hr />
                    <FormAddToCart colors={product?.colors} />
                </div>
            </div>
        </div>
    );
};

export default Detail;
