'use client';
import FilterSearch from '@/components/FilterSearch';
import Loading from '@/components/Loading';
import ProductCard from '@/components/Product/ProductCard';
import { getAllProducts } from '@/services/product.service';
import { checkShowProduct } from '@/utils/site';
import { useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const ProductsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const textSearch = searchParams.get('textSearch');
    const price = searchParams.get('price');
    const percent = Number(searchParams.get('percent'));
    const star = Number(searchParams.get('star'));
    const sortBy = searchParams.get('sortBy');
    const filter = { textSearch, price, percent, star, sortBy };

    const getProductsQuery = useQuery({
        queryKey: ['get-products', filter],
        queryFn: () => {
            return getAllProducts(filter);
        },
    });
    const products = getProductsQuery?.data?.products?.filter((p) =>
        checkShowProduct(p),
    );
    console.log('🚀 ~ file: page.jsx:31 ~ ProductsPage ~ products:', products);
    return (
        <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-2 sticky ">
                <FilterSearch />
            </div>
            {getProductsQuery.isLoading && <Loading />}
            {products?.length ? (
                <div className="col-span-10 grid grid-cols-5 gap-5  relative">
                    {products?.map((product) => (
                        <div className="" key={product._id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-10 flex w-full justify-center items-center">
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <SearchX size={'60px'} />
                        No results found
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
