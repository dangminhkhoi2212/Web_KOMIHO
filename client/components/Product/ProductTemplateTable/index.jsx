'use client';
import Link from 'next/link';
import routes from '@/routes';
import dynamic from 'next/dynamic';
import {
    getAllowDeletedImages,
    getLimitFilter,
    getListDeletedImages,
    getPageFilter,
    getPriceFilter,
    getStoreFilter,
    getTextSearchFilter,
    getUserId,
} from '@/redux/selector';
import { deleteProduct, getProductsByUserId } from '@/services/product.service';

import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5';
import { LiaArrowsAltVSolid } from 'react-icons/lia';
import { Button } from 'flowbite-react';
import clsx from 'clsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { formatPrice } from '@/utils/format';
import {
    setPage,
    setPrice,
    setStore,
    setTextSearch,
} from '@/redux/filterSearchSlice';
import { deleteImages } from '@/services/image.service';
import {
    removeDeletedImages,
    resetListDeletedImages,
} from '@/redux/listDeletedImages';
const Search = dynamic(() => import('@/components/Header/Search'));

const Pagination = dynamic(() => import('@/components/Pagination'));

const Loading = dynamic(() => import('@/components/Loading'));
const Modal = dynamic(() => import('@/components/Modal'));
const FormEditProduct = dynamic(() =>
    import('@/components/Product/FormEditProduct'),
);

const ProductTemplate = ({ listChose, setListChose }) => {
    const userId = useSelector(getUserId);
    const [chooseProduct, setChooseProduct] = useState(null);
    const queryClient = useQueryClient();
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch();
    const price = useSelector(getPriceFilter);
    const store = useSelector(getStoreFilter);
    const page = useSelector(getPageFilter);
    const limit = useSelector(getLimitFilter);
    const textSearch = useSelector(getTextSearchFilter);
    const allowDeleted = useSelector(getAllowDeletedImages);
    const [editProduct, setEditProduct] = useState(null);

    const getProducts = useQuery({
        queryKey: ['products', price, store, page, textSearch],
        queryFn: () => {
            return getProductsByUserId({
                userId,
                price,
                store,
                page,
                limit,
                textSearch,
            });
        },
        refetchOnWindowFocus: false,
        cacheTime: 1 * 60 * 1000,
    });
    const products = getProducts?.data?.products || [];
    const handleDeleteProduct = useMutation({
        mutationKey: ['products'],
        mutationFn: (productId) => {
            return deleteProduct(productId);
        },
        onSuccess(data) {
            if (data.status == 'success') {
                toast.success('Product deleted successfully.');
                queryClient.invalidateQueries(['products']);
                setChooseProduct(null);
            }
        },
        onError(error) {
            console.log('🚀 ~ file: page.jsx:31 ~ onError ~ error:', error);
            toast.error('Product delete failed. Please try again.');
        },
    });

    const checkAllChecked = listChose?.length === products?.length;

    const handleSelectOneProduct = (productId) => {
        const existed = listChose.some((id) => id === productId);
        if (existed) {
            setListChose((pre) => pre.filter((id) => id !== productId));
        } else {
            setListChose((pre) => [...pre, productId]);
        }
    };

    const handleDeleteImages = useMutation({
        mutationFn: (images) => {
            return deleteImages(images);
        },
        onSuccess() {
            dispatch(resetListDeletedImages());
        },
    });
    useEffect(() => {
        if (checked) {
            setListChose(products.map((product) => product._id));
        } else {
            setListChose([]);
        }
    }, [checked]);

    const handlePriceClick = () => {
        dispatch(setPrice(price == 'asc' ? 'desc' : 'asc'));
    };
    const handleStoreClick = () => {
        dispatch(setStore(store == 'asc' ? 'desc' : 'asc'));
    };

    const handlePageClick = async (data) => {
        dispatch(setPage(data + 1));
        await queryClient.invalidateQueries(['products', page]);
    };

    const handleSearch = async (data) => {
        dispatch(setTextSearch(data.textSearch));
        await queryClient.invalidateQueries(['products', textSearch]);
    };
    const listDeletedImages = useSelector(getListDeletedImages);

    const handleEventModal = () => {
        if (listDeletedImages.length > 0 && allowDeleted)
            handleDeleteImages.mutate(listDeletedImages);
        else setEditProduct(null);
        setEditProduct(null);
    };

    useEffect(() => {
        setEditProduct(null);
    }, [handleDeleteImages.isLoading]);
    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <Search handleEvent={(data) => handleSearch(data)} />
            {chooseProduct && (
                <Modal
                    handleEvent={() => setChooseProduct(null)}
                    label={'Delete product'}>
                    {handleDeleteProduct.isLoading && <Loading sizeProp={60} />}
                    <div className="text-center">
                        <h3 className=" my-2">
                            <span className="">
                                Are you sure you want to delete product has ID:{' '}
                            </span>
                            <span className="font-medium">
                                {chooseProduct}?
                            </span>
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => {
                                    handleDeleteProduct.mutate(chooseProduct);
                                }}>
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setChooseProduct(null)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {editProduct && (
                <Modal
                    label={'Edit Product'}
                    handleEvent={() => handleEventModal()}
                    size="4xl">
                    {handleDeleteImages.isLoading && <Loading />}
                    <FormEditProduct product={editProduct || null} />
                </Modal>
            )}
            {products?.length == 0 ? (
                <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="text-center text-lg font-medium">
                        No products were found.
                    </p>
                </div>
            ) : (
                <>
                    <table className="w-full min-h-[300px] flex flex-col gap-3 ">
                        <thead className="border-b-2 pb-2">
                            <tr className="grid grid-cols-12 place-items-center">
                                <th className="col-span-1">
                                    <input
                                        type="checkbox"
                                        name="productId"
                                        className="rounded-md w-5 h-5 mr-2 checked:bg-primary checked:outline-primary"
                                        id="all"
                                        checked={checkAllChecked}
                                        onChange={() => {
                                            setChecked(!checked);
                                        }}
                                    />
                                    <label htmlFor="all">All</label>
                                </th>
                                <th className="col-span-6 ">ITEM</th>
                                <th
                                    className="col-span-2 flex gap-2 justify-center items-center hover:bg-primary rounded-md w-fit p-1 cursor-pointer"
                                    onClick={() => handlePriceClick()}>
                                    PRICE
                                    <LiaArrowsAltVSolid />
                                </th>
                                <th
                                    className="col-span-1 flex gap-2 justify-center items-center hover:bg-primary rounded-md w-fit p-1 cursor-pointer"
                                    onClick={() => handleStoreClick()}>
                                    STORE
                                    <LiaArrowsAltVSolid />
                                </th>
                                <th className="col-span-2">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="flex flex-col gap-3">
                            {products.map((product, index) => {
                                return (
                                    <tr
                                        key={product._id}
                                        className="grid grid-cols-12 place-items-center gap-4">
                                        <td className="col-span-1 flex gap-2 items-center">
                                            <button
                                                className={clsx(
                                                    'text-center py-1 rounded-md ring-1 w-8 ',
                                                    listChose.some(
                                                        (id) =>
                                                            id === product._id,
                                                    )
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white',
                                                )}
                                                onClick={() =>
                                                    handleSelectOneProduct(
                                                        product._id,
                                                    )
                                                }>
                                                {index + 1}
                                            </button>
                                        </td>
                                        <td className=" col-span-6 flex gap-3 items-center place-self-start">
                                            <div className="relative w-[60px] h-[60px] ">
                                                <Image
                                                    src={product.images[0].url}
                                                    fill
                                                    sizes="60px"
                                                    alt={product.name}
                                                    className="object-contain object-center rounded-md ring-1"
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
                                        <td className="col-span-2">
                                            {formatPrice(product.price.final)}
                                        </td>
                                        <td className="col-span-1">
                                            {product.store}
                                        </td>
                                        <td className="col-span-2">
                                            <div className="flex gap-3 items-start text-white">
                                                <button
                                                    onClick={() =>
                                                        setEditProduct(product)
                                                    }>
                                                    <FiEdit2 className="h-8 w-8  p-2 rounded-xl bg-green-400 shadow-md shadow-green-400 hover:shadow-lg hover:shadow-green-400" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setChooseProduct(
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
                </>
            )}
            <Pagination
                pageCount={getProducts?.data?.pageCount || 1}
                handleEvent={handlePageClick}
            />
        </div>
    );
};

export default memo(ProductTemplate);
