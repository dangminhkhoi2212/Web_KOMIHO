'use client';
import SearchCpn from '@/components/Search';
import { routes } from '@/routes';
import { getAllProducts } from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { route } from 'nextjs-routes';
import React from 'react';
import { useEffect } from 'react';
import { DataTable } from './data-table';
import Pagination from '@/components/Pagination';
import { columns } from './columns';
import { clearOject } from '@/utils/site';
import Loading from '@/components/Loading';
const ProductsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = searchParams.get('page') || undefined;
    console.log('🚀 ~ file: page.jsx:18 ~ ProductsPage ~ page:', page);
    const limit = searchParams.get('limit') || undefined;
    console.log('🚀 ~ file: page.jsx:20 ~ ProductsPage ~ limit:', limit);
    const textSearch = searchParams.get('textSearch');
    const getAllProductsQuery = useQuery({
        queryKey: ['get-all-products'],
        queryFn: () => {
            return getAllProducts({ page, limit, textSearch });
        },
    });
    useEffect(() => {
        getAllProductsQuery.refetch();
    }, [limit, page, textSearch]);
    const data = getAllProductsQuery?.data;
    const products = data?.products;
    const handleTextSearch = (textSearch) => {
        let query = clearOject({ limit, textSearch });
        const newRoute = route({
            pathname: routes.products,
            query,
        });
        router.replace(newRoute);
    };
    const handleRefresh = () => {
        let query = clearOject({ limit });

        const newRoute = route({ pathname: routes.products, query });
        router.replace(newRoute);
    };
    const handleSelectPage = (page) => {
        let query = clearOject({ page, limit, textSearch });

        const newRoute = route({ pathname: routes.products, query });
        router.replace(newRoute);
    };
    if (!data || !products) return <></>;
    return (
        <div className="flex flex-col gap-4 relative">
            {getAllProductsQuery.isPending && <Loading />}
            <div className="flex gap-3 items-center">
                <SearchCpn handleEvent={handleTextSearch} />
                <button type="button" onClick={() => handleRefresh()}>
                    <RotateCw className="bg-accent rounded-full p-2 text-white w-8 h-8" />
                </button>
            </div>
            {textSearch && (
                <div>
                    Result(s) of{' '}
                    <span className="font-medium text-xl">{textSearch}</span>
                </div>
            )}
            <div className="bg-white p-4 rounded-lg">
                <DataTable columns={columns} data={products} />
                <div className="flex justify-center items-center">
                    <Pagination
                        page={page || 1}
                        pageCount={data?.pageCount}
                        handleEvent={handleSelectPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
