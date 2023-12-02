'use client';
import Loading from '@/components/Loading';
import Slider from '@/components/Silder';
import ProductCard from '@/components/Product/ProductCard';
import { getAllProducts } from '@/services/product.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import CarouselImage from '@/public/images/carousel.svg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import routes from '@/routes';
import MenuBar from '@/components/MenuBar';
import { useRouter } from 'next/navigation';
import { isShowProduct } from '@/utils/site';

export const filterProductShow = (products) => {
    if (!products) return null;
    return products.filter((product) => isShowProduct(product));
};
export default function Home() {
    const router = useRouter();

    // Top percent discount
    const getTopPercentDiscount = useQuery({
        queryKey: ['top-percent-discount'],
        queryFn: () => {
            return getAllProducts({ percent: 50, limit: 12 });
        },
    });
    const topPercentDiscount = filterProductShow(
        getTopPercentDiscount?.data?.products,
    );
    console.log(
        '🚀 ~ file: page.jsx:33 ~ Home ~ getTopPercentDiscount?.data:',
        getTopPercentDiscount?.data,
    );
    // Top products sold
    const getTopProductsSold = useQuery({
        queryKey: ['top-sold'],
        queryFn: () => {
            return getAllProducts({ sortBy: 'top-sold', limit: 12 });
        },
    });
    const topSoldProducts = filterProductShow(
        getTopProductsSold?.data?.products,
    );
    // Top products view
    const getTopProductsViews = useQuery({
        queryKey: ['top-views'],
        queryFn: () => {
            return getAllProducts({ sortBy: 'top-views', limit: 12 });
        },
    });
    const topProductsViews = filterProductShow(
        getTopProductsViews?.data?.products,
    );

    const list = [
        {
            title: 'Over 50% off on sale ',
            products: topPercentDiscount,
            seeMore: `${routes.products}?percent=50`,
        },
        {
            title: 'Top products sold ',
            products: topSoldProducts,
            seeMore: `${routes.products}?sortBy=top-sold`,
        },
        {
            title: 'Top products views',
            products: topProductsViews,
            seeMore: `${routes.products}?sortBy=top-views`,
        },
    ];
    return (
        <div className="text-center w-full flex flex-col gap-4 ">
            {/* <Slider /> */}
            <div className="bg-[url('../public/images/bg_home.svg')] bg-no-repeat bg-cover bg-center h-[450px] rounded-lg  grid grid-cols-3 place-items-center gap-5">
                <div className="">
                    <h3 className="text-gray-500 font-semibold text-xl">
                        Explore a variety of different products.
                    </h3>
                    <h3 className="text-gray-500 font-semibold text-xl">
                        {' '}
                        Choose your style now
                    </h3>
                    <Button
                        onClick={() => router.push(routes.products)}
                        className="mt-5">
                        Shop Now
                    </Button>
                </div>
                <div className="w-[550px] h-[300px] bg-[url('../public/images/carousel.svg')] rounded-lg bg-no-repeat bg-cover bg-center"></div>

                <div>
                    <h3 className="text-gray-500 font-semibold text-xl">
                        Become a potential seller
                    </h3>
                    <Button
                        className="mt-5"
                        onClick={() =>
                            router.push(`${routes.managerAddProduct}`)
                        }>
                        Add Product
                    </Button>
                </div>
            </div>

            {getTopPercentDiscount.isLoading && <Loading />}
            {list.map((item, index) => (
                <div className="flex flex-col gap-5 " key={index}>
                    <MenuBar
                        list={[
                            {
                                name: item.title,
                                active: true,
                            },
                        ]}
                        clss={{
                            'bg-gradient-to-r from-red-300 to-yellow-200 text-red-500 font-bold block':
                                index === 0,
                        }}
                    />
                    <div className="grid grid-cols-6 gap-5 place-items-center">
                        {item?.products?.map((product) => (
                            <div className="" key={product._id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <Button
                        className="w-52 mx-auto"
                        onClick={() => router.push(item.seeMore)}>
                        See more
                    </Button>
                </div>
            ))}
        </div>
    );
}
