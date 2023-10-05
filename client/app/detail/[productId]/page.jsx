'use client';
import { useQuery } from '@tanstack/react-query';
import React, { Suspense, useEffect, useState } from 'react';
import Carousel from '@/components/ProductDetail/Carousel';
import { getProductByProductId } from '@/services/product.service';
import Price from '@/components/ProductDetail/Price';
import { AiOutlineEye } from 'react-icons/ai';
import FormAddToCart from '@/components/ProductDetail/FormAddToCart';
import { Badge, Button } from 'flowbite-react';
import AvatarText from '@/components/Avatar';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { BsShop } from 'react-icons/bs';
import Link from 'next/link';
import InfoSeller from '@/components/ProductDetail/InfoSeller';
import routes from '@/routes';
import Loading from './loading';
import LoadingCpn from '@/components/Loading';
function createMarkup(data) {
    if (!data) return;
    return { __html: data.toString() };
}
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

    console.log(
        '🚀 ~ file: page.jsx:41 ~ Detail ~ getProductQuery?.isLoading:',
        getProductQuery,
    );
    return (
        <div className="flex flex-col gap-5 px-20 relative">
            {getProductQuery.isLoading && <LoadingCpn />}
            <Suspense fallback={<Loading />}>
                <div className="grid grid-cols-12 px-20 py-10 bg-white rounded-md gap-5">
                    <div className="col-span-4 mx-6 py-3 rounded-md ">
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
                        <FormAddToCart product={product} />
                    </div>
                </div>
                <div className="px-10 bg-white rounded-md ">
                    <InfoSeller user={product?.userId} />
                </div>
                <div className="px-20 py-10 bg-white rounded-md gap-5">
                    <Badge color="indigo" size="xl">
                        <h1 className="font-medium"> PRODUCT DESCRIPTION</h1>
                    </Badge>
                    <div
                        dangerouslySetInnerHTML={createMarkup(
                            product?.description,
                        )}></div>
                </div>
                <div className="px-20 py-10 bg-white rounded-md gap-5">
                    <Badge color="indigo" size="xl">
                        <h1 className="font-medium"> PRODUCT RATINGS</h1>
                    </Badge>
                </div>
            </Suspense>
        </div>
    );
};

export default Detail;
