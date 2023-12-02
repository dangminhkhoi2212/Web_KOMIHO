'use client';
import FilterSearch from '@/components/FilterSearch';
import Loading from '@/components/Loading';
import ProductCard from '@/components/Product/ProductCard';
import { getAllProducts } from '@/services/product.service';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isShowProduct } from '@/utils/site';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import Link from 'next/link';
import routes from '@/routes';
const ProductsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const textSearch = searchParams.get('textSearch');
    const price = searchParams.get('price');
    const percentTemp = searchParams.get('percent');
    const starTemp = searchParams.get('star');
    const percent = percentTemp;
    const star = starTemp;
    const sortBy = searchParams.get('sortBy');
    const filter = { textSearch, price, percent, star, sortBy };

    const [products, setProducts] = useState([]);
    const {
        data,
        error,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(
        ['get-all-products', filter],
        async ({ pageParam = 1 }) => {
            return getAllProducts({ page: pageParam, limit: 11, ...filter });
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.page < lastPage.pageCount
                    ? lastPage.page + 1
                    : undefined;
            },
        },
    );
    useEffect(() => {
        let temp = [];
        data?.pages?.forEach((d) => {
            temp = [...temp, ...d.products?.filter((p) => isShowProduct(p))];
        });
        if (temp) setProducts(temp);
    }, [data?.pages]);

    return (
        <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-2 sticky ">
                <FilterSearch />
            </div>

            <div className="col-span-10 relative">
                {textSearch && (
                    <Link
                        href={`${routes.sellers}?textSearch=${textSearch}`}
                        className="bg-white py-3 text-center rounded-lg mb-3 flex justify-center items-center gap-3">
                        <Store className="animate-bounce" />
                        Find Sellers with{' '}
                        <span className="italic font-bold">{textSearch}</span>
                    </Link>
                )}
                {products?.length ? (
                    <>
                        <InfiniteScroll
                            dataLength={products.length}
                            next={fetchNextPage}
                            hasMore={!!hasNextPage}
                            loader={<Loading sizeProp={50} />}
                            className=" grid grid-cols-5 gap-5  relative">
                            {products?.map((product) => (
                                <div className="" key={product?._id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </InfiniteScroll>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <SearchX size={'60px'} />
                        No results found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
