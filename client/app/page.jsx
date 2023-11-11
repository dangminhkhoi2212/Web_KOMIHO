'use client';
import Loading from '@/components/Loading';
import Slider from '@/components/Silder';
import ProductCard from '@/components/Store/ProductCard';
import { getAllProducts } from '@/services/product.service';
import { useMutation, useQuery } from '@tanstack/react-query';
export default function Home() {
    const getAllProductsQuery = useQuery({
        queryKey: ['all-products'],
        queryFn: () => {
            return getAllProducts({ page: 1 });
        },
    });
    const data = getAllProductsQuery?.data?.products;
    if (!data) return <></>;
    const products = data.filter(
        (product) => product.active && !product?.lock?.status,
    );
    return (
        <h1 className="text-center w-full h-full">
            {/* <Slider /> */}
            {getAllProductsQuery.isLoading && <Loading />}
            <div className="grid grid-cols-6 gap-5 place-items-center">
                {products.map((product) => (
                    <div className="" key={product._id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </h1>
    );
}
