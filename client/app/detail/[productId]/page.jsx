'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { Suspense, useEffect, useState } from 'react';
import Carousel from '@/components/Product/Carousel';
import { getProductByProductId } from '@/services/product.service';
import Price from '@/components/Product/Price';
import { AiOutlineEye } from 'react-icons/ai';
import FormAddToCart from '@/components/Product/FormAddToCart';
import { Badge } from 'flowbite-react';
import AvatarText from '@/components/Avatar';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { BsShop } from 'react-icons/bs';
import Link from 'next/link';
import InfoSeller from '@/components/Product/InfoSeller';
import routes from '@/routes';
import Loading from './loading';
import LoadingCpn from '@/components/Loading';
import Feedback from '@/components/Product/Feedback';
import MenuBar from '@/components/MenuBar';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getUserApi } from '@/services/user.service';
import { Rating } from 'react-simple-star-rating';
import Modal from '@/components/Modal';
import { Frown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import {
    DropdownMenu,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormReport from '@/components/Product/FormReport';
import InfoProduct from '@/components/Feedback/InfoProduct';
import { getReports } from '@/services/report.service';
function createMarkup(data) {
    if (!data) return;
    return { __html: data.toString() };
}

const Detail = ({ params }) => {
    const [product, setProduct] = useState(null);
    const router = useRouter();
    const stars = useSearchParams().get('stars');
    const userId = useSelector(getUserId);
    const [openReport, setOpenReport] = useState(false);
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
    const allowAccess = () => {
        if (userId !== getProductQuery?.data?.userId) {
            if (!product?.lock?.status || !product?.active) return false;
            return true;
        }
        return false;
    };

    if (!product) return <></>;
    return (
        <div className="flex flex-col gap-5 px-20 relative">
            {allowAccess() && (
                <Modal
                    label={'NOTICE'}
                    handleEvent={() => {
                        router.push(routes.home);
                    }}>
                    <div className="flex flex-col justify-center items-center">
                        <Frown className="w-8 h-8" />
                        <p>This product was locked! </p>
                    </div>
                    <Button
                        onClick={() => router.push(routes.home)}
                        color="blue"
                        className="float-right bg-primary border-none outline-none ring-0">
                        Ok
                    </Button>
                </Modal>
            )}
            {getProductQuery.isLoading && <LoadingCpn />}
            <Suspense fallback={<Loading />}>
                <div className="grid grid-cols-12 px-20 py-10 bg-white rounded-md gap-5 relative">
                    <div className="absolute right-0 m-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Button
                                    variant="ghost"
                                    className="hover:text-white w-full"
                                    onClick={() => setOpenReport(true)}>
                                    Report
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* form report */}
                    {openReport && (
                        <Modal
                            handleEvent={() => setOpenReport(false)}
                            label={'REPORT'}>
                            <div className="flex flex-col gap-2">
                                <InfoProduct product={product} />
                                <FormReport
                                    userId={userId}
                                    productId={product._id}
                                />
                            </div>
                        </Modal>
                    )}
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
                            <AiOutlineEye className="text-lg" />
                            {product?.views} views
                        </div>
                        <hr />
                        <FormAddToCart product={product} />
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
