'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import { getUserId } from '@/redux/selector';
import { deleteProduct, getProductsByUserId } from '@/services/product.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5';
import { Avatar } from 'flowbite-react';
import Link from 'next/link';
import routes from '@/routes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

const AllProduct = () => {
    const userId = useSelector(getUserId);
    const dispatch = useDispatch;
    const queryClient = useQueryClient();
    const getProducts = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            return await getProductsByUserId({ userId });
        },
    });
    const handleDeleteProduct = useMutation({
        mutationKey: ['products'],
        mutationFn: async (productId) => {
            return await deleteProduct(productId);
        },
        onSuccess(data) {
            if (data.status == 'success') {
                toast.success('Product deleted successfully.');
                queryClient.invalidateQueries(['products']);
            }
        },
        onError(error) {
            console.log('🚀 ~ file: page.jsx:31 ~ onError ~ error:', error);
            toast.error('Product delete failed. Please try again.');
        },
    });

    return (
        <AccountTemplate
            title={'ALL PRODUCTS'}
            note={'Edit all your products'}
            button={
                <Link
                    href={routes.managerAddProduct}
                    className="flex gap-3 px-3 py-2 border-2 border-solid border-secondary items-center hover:bg-secondary rounded-full">
                    <p>Add</p>
                    <IoAddOutline className="h-8 w-8 rounded-full bg-accent text-white" />
                </Link>
            }>
            {(handleDeleteProduct.isLoading || getProducts.isLoading) && (
                <Loading />
            )}
            {getProducts.data?.length == 0 ? (
                <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="text-center">You haven't any product.</p>
                    <Link
                        href={routes.managerAddProduct}
                        className="flex gap-3 px-3 py-2 border-2 border-solid border-secondary items-center hover:bg-secondary rounded-full">
                        <p>Add now</p>
                        <IoAddOutline className="h-8 w-8 rounded-full bg-accent text-white" />
                    </Link>
                </div>
            ) : (
                <table className="w-full table-auto ">
                    <thead className="">
                        <tr className="grid grid-cols-7">
                            <th className="col-span-4">ITEM</th>
                            <th className="col-span-1">PRICE</th>
                            <th className="col-span-1">STORE</th>
                            <th className="col-span-1">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="flex flex-col gap-3">
                        {getProducts.data?.map((product) => {
                            return (
                                <tr
                                    key={product._id}
                                    className="grid grid-cols-7 place-items-center gap-4">
                                    <td className=" col-span-4 flex gap-3 items-center place-self-start">
                                        <div className="relative w-[60px] h-[60px] ">
                                            <Image
                                                src={product.images[0].url}
                                                fill={true}
                                                alt={product.name}
                                                className="object-cover object-center rounded-md ring-1"
                                            />
                                        </div>
                                        <div className="flex flex-col ">
                                            <span className=" line-clamp-2 text-sm font-medium">
                                                {product.name}
                                            </span>
                                            <span className="text-sm font-light text-gray-500">
                                                ID: {product._id}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="col-span-1">
                                        {product.price.final}
                                    </td>
                                    <td className="col-span-1">
                                        {product.store}
                                    </td>
                                    <td className="col-span-1">
                                        <div className="flex gap-3 items-start text-white">
                                            <button>
                                                <FiEdit2 className="h-8 w-8  p-2 rounded-xl bg-green-400 shadow-md shadow-green-400 hover:shadow-lg hover:shadow-green-400" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteProduct.mutate(
                                                        product._id,
                                                    )
                                                }>
                                                <AiOutlineDelete className="h-8 w-8 p-2 rounded-xl bg-red-400 shadow-md shadow-red-400 hover:shadow-lg hover:shadow-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </AccountTemplate>
    );
};

export default AllProduct;
