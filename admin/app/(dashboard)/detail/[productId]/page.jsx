'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { Suspense, useEffect, useState } from 'react';
import Carousel from '@/components/ProductDetail/Carousel';
import { getProductByProductId } from '@/services/product.service';
import Price from '@/components/ProductDetail/Price';

import Link from 'next/link';
import InfoSeller from '@/components/InfoSeller';
import { routes } from '@/routes';
import Loading from './loading';
import LoadingCpn from '@/components/Loading';
import Feedback from '@/components/ProductDetail/Feedback';
import MenuBar from '@/components/MenuBar';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getUserApi } from '@/services/user.service';
import { Rating } from 'react-simple-star-rating';
import { Eye } from 'lucide-react';
import DialogCustom from '@/components/Dialog';
import { Badge } from '@/components/ui/badge';
function createMarkup(data) {
    if (!data) return;
    return { __html: data.toString() };
}

const Detail = ({ params }) => {
    const [product, setProduct] = useState(null);
    const router = useRouter();
    const stars = useSearchParams().get('stars');
    const getProductQuery = useQuery({
        queryKey: ['get-detail-product'],
        queryFn: () => {
            return getProductByProductId(params.productId);
        },
        refetchOnWindowFocus: false,
    });
    // const product = getProductQuery?.data;
    useEffect(() => {
        setProduct(getProductQuery?.data);
    }, [getProductQuery?.data]);

    const MenuFeedback = [
        { name: 'All', tab: 'all', active: !stars },
        {
            name: `5 stars (${product?.ratingsCount?.five || 0})`,
            tab: 5,
            active: stars === '5',
        },
        {
            name: `4 stars (${product?.ratingsCount?.four || 0})`,
            tab: 4,
            active: stars === '4',
        },
        {
            name: `3 stars (${product?.ratingsCount?.three || 0})`,
            tab: 3,
            active: stars === '3',
        },
        {
            name: `2 stars (${product?.ratingsCount?.two || 0})`,
            tab: 2,
            active: stars === '2',
        },
        {
            name: `1 stars (${product?.ratingsCount?.one || 0})`,
            tab: 1,
            active: stars === '1',
        },
    ];

    const getUserMutation = useMutation({
        mutationFn: (userId) => {
            return getUserApi(userId);
        },
    });
    useEffect(() => {
        if (getProductQuery?.data) {
            getUserMutation.mutate(getProductQuery?.data?.userId);
        }
    }, [getProductQuery?.data]);

    const handleSelectTabStar = (tab) => {
        if (tab !== 'all') {
            router.replace(
                `${routes.productDetail(params.productId)}?stars=${tab}`,
                {
                    scroll: false,
                },
            );
        } else
            router.replace(routes.productDetail(params.productId), {
                scroll: false,
            });
    };

    if (!product) return <></>;

    return (
        <div className="flex flex-col gap-5 px-20 relative">
            {getProductQuery.isPending && <LoadingCpn />}
            <Suspense fallback={<Loading />}>
                <div className="grid grid-cols-12 px-20 py-10 bg-white rounded-md gap-5">
                    <div className="col-span-4 mx-6 py-3 rounded-md ">
                        <Carousel images={product?.images} />
                    </div>
                    <div className="col-span-8 p-10 flex gap-3 flex-col">
                        <h1 className="text-2xl ">{product?.name}</h1>
                        <div className="flex gap-5 items-center">
                            <div className="flex gap-2 items-end">
                                <p>{product?.totalRatings || 0}</p>
                                <Rating
                                    SVGclassName="inline"
                                    size={20}
                                    allowFraction
                                    initialValue={product?.totalRatings || 0}
                                    readonly={true}
                                />
                            </div>
                            <div className="h-full w-[1px] bg-gray-300"></div>
                            <p>{product?.countRatings || 0} Ratings</p>
                            <div className="h-full w-[1px] bg-gray-300"></div>
                            <p>{product?.countSold || 0} Sold</p>
                        </div>
                        <Price price={product?.price} />
                        <div className="flex gap-3 items-center">
                            <Eye className="text-lg" />
                            {product?.views} views
                        </div>
                    </div>
                </div>
                <div className="px-10 bg-white rounded-md ">
                    <InfoSeller user={getUserMutation?.data} />
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
                <div className="px-20 py-10 bg-white rounded-md flex flex-col gap-5">
                    <Badge color="indigo" size="xl">
                        <h1 className="font-medium"> PRODUCT RATINGS</h1>
                    </Badge>
                    <MenuBar
                        list={MenuFeedback}
                        handleEvent={handleSelectTabStar}
                    />
                    <Feedback productId={params.productId} />
                </div>
            </Suspense>
        </div>
    );
};

export default Detail;
