'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/Store/ProductCard';
import { getProducts } from '@/services/product.service';
import { IoAddOutline } from 'react-icons/io5';
import Link from 'next/link';
import routes from '@/routes';
import { useQuery } from '@tanstack/react-query';
const All = ({ params }) => {
    if (!params?.userId) return;
    const [product, setProduct] = useState(null);

    const getProductsQuery = useQuery({
        queryKey: ['store-all'],
        queryFn: () => {
            return getProducts({
                userId: params.userId,
            });
        },
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        setProduct(getProductsQuery?.data);
    }, [getProductsQuery]);
    return (
        <>
            {getProductsQuery?.data?.products?.length === 0 ? (
                <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="text-center">You haven't any product.</p>
                    <Link
                        href={routes.managerAddProduct}
                        className="flex gap-3 px-2 py-1 border-2 border-solid border-secondary items-center hover:bg-secondary rounded-full">
                        <p>Add now</p>
                        <IoAddOutline className="h-8 w-8 rounded-full bg-accent text-white" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-5 auto-rows-max justify-items-center gap-3">
                    {getProductsQuery?.data?.products?.map((product) => (
                        <div key={product._id} className="col-span-1">
                            <ProductCard product={product} key={product._id} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default All;
