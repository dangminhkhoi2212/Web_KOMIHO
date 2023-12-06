'use client';
import Link from 'next/link';
import routes from '@/routes';
import { route } from 'nextjs-routes';
import {
    getChooseProduct,
    getChooseStatus,
    getLimitFilter,
    getPageFilter,
    getPriceFilter,
    getSelectProductInTable,
    getStoreFilter,
    getTextSearchFilter,
    getUserId,
} from '@/redux/selector';
import {
    deleteManyProducts,
    deleteProduct,
    getAllProducts,
    getProducts,
} from '@/services/product.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5';
import { BiRefresh } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import AccountTemplate from '@/components/Account/AccountTemplate';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import ButtonModal from '@/components/Modal/ButtonModal';

import { columns } from './columns';
import { DataTable } from './data-table';
import { formatPrice } from '@/utils/format';
import FormEditProduct from '@/components/Product/FormEditProduct';
import Image from 'next/image';
import { removeChooseProduct } from '@/redux/chooseProductSlice';
import { resetSelectProductInTable } from '@/redux/selectProductInTable';
import Search from '@/components/Header/Search';
import { setPage, setTextSearch } from '@/redux/filterSearchSlice';
import { useSearchParams, useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { clearObject } from '@/utils/site';
const AllProduct = () => {
    const router = useRouter();
    const userId = useSelector(getUserId);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const textSearch = searchParams.get('textSearch');

    const chooseProduct = useSelector(getChooseProduct);
    const chooseStatus = useSelector(getChooseStatus);
    const selectProductInTable = useSelector(getSelectProductInTable);

    const [modalDeleteMany, setShowModalDeleteMany] = useState(false);
    const dispatch = useDispatch();
    const getProductsQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => {
            return getAllProducts({
                textSearch: textSearch,
                page,
                userId,
                withFullImages: true,
                limit,
            });
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        getProductsQuery.refetch();
    }, [textSearch, page, limit]);

    const deleteManyProductsMutation = useMutation({
        mutationFn: (productIds) => {
            return deleteManyProducts({ ids: productIds, userId });
        },
        onSuccess(data) {
            if (data.ok) {
                dispatch(removeChooseProduct());
                queryClient.invalidateQueries(['products']);
                toast.success('Delete products successfully.');
                dispatch(resetSelectProductInTable());
                setShowModalDeleteMany(false);
            }
        },
        onError(error) {
            console.log('🚀 ~ file: page.jsx:102 ~ onError ~ error:', error);
            const errorMessage = error.message || 'Delete products failed';
            toast.warning(errorMessage);
        },
    });

    // handle button modal
    const handleCancel = () => {
        dispatch(removeChooseProduct());
    };

    const handleButtonDeleteMany = () => {
        if (!selectProductInTable.length) {
            toast.warning('You do not choose product.');
            setShowModalDeleteMany(false);
            return;
        }
        deleteManyProductsMutation.mutate(selectProductInTable);
    };

    const handleSearch = ({ textSearch }) => {
        const query = clearObject({ limit, textSearch });
        const newRoute = route({
            pathname: routes.managerAllProducts,
            query,
        });
        router.replace(newRoute);
    };

    const handleRefresh = () => {
        const query = clearObject({ limit });
        const newRoute = route({
            pathname: routes.managerAllProducts,
            query,
        });
        router.replace(newRoute);
    };
    const products = getProductsQuery?.data?.products;

    const pageCount = getProductsQuery?.data?.pageCount;
    const handlePageClick = (page) => {
        const query = clearObject({ page, limit, textSearch });
        const newRoute = route({
            pathname: routes.managerAllProducts,
            query,
        });
        router.replace(newRoute);
    };
    if (!products) return <Loading />;
    return (
        <AccountTemplate
            title={'ALL PRODUCTS'}
            note={'Edit all your products'}
            button={
                <div className="flex gap-5">
                    <button
                        onClick={() => {
                            if (!selectProductInTable.length) {
                                toast.warning(
                                    'You have not selected any product yet.',
                                );
                            } else setShowModalDeleteMany(true);
                        }}
                        className="flex gap-3 px-2 py-1 border-2 border-solid border-secondary items-center hover:bg-red-200 hover:border-red-200 rounded-full shadow-md">
                        <span className="text-sm">Delete many</span>
                        <AiOutlineDelete className="h-8 w-8 p-2 rounded-full bg-red-400 shadow-lg text-white" />
                    </button>
                    <Link
                        href={routes.managerAddProduct}
                        className="flex gap-3 px-2 py-1 border-2 border-solid border-secondary items-center hover:bg-secondary rounded-full shadow-md">
                        <span className="text-sm">Add</span>
                        <IoAddOutline className="h-8 w-8 rounded-full bg-accent text-white" />
                    </Link>
                </div>
            }>
            {chooseProduct && chooseStatus === 'edit' && (
                <Modal
                    label={'UPDATE'}
                    handleEvent={() => handleCancel()}
                    size="4xl">
                    <FormEditProduct product={chooseProduct} />
                </Modal>
            )}
            {chooseProduct && chooseStatus === 'delete' && (
                <Modal label={'UPDATE'} handleEvent={() => handleCancel()}>
                    {deleteManyProductsMutation.isLoading && (
                        <Loading sizeProp={60} />
                    )}
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <h1>Do you want delete this product?</h1>
                        <div className="flex gap-3 items-center">
                            <div className="relative w-[60px] h-[60px] ">
                                <Image
                                    src={chooseProduct.images[0]?.url}
                                    fill
                                    sizes="60px"
                                    alt={chooseProduct.images[0]?.url}
                                    className="object-contain object-center rounded-md ring-1"
                                />
                            </div>
                            <span className="max-w-[200px]">
                                {chooseProduct.name}
                            </span>
                        </div>

                        <ButtonModal
                            handleYes={() => {
                                deleteManyProductsMutation.mutate([
                                    chooseProduct._id,
                                ]);
                            }}
                            handleNo={() => handleCancel()}
                        />
                    </div>
                </Modal>
            )}
            <div className="flex justify-between items-center">
                <button
                    className="p-1 rounded-full bg-accent"
                    onClick={() => handleRefresh()}>
                    <BiRefresh className="text-2xl text-white" />
                </button>
                <div className="max-w-xl">
                    <Search handleEvent={(data) => handleSearch(data)} />
                </div>
            </div>
            {modalDeleteMany && (
                <Modal
                    label={'DELETE MANY'}
                    handleEvent={() => setShowModalDeleteMany(false)}>
                    <div className="flex flex-col items-center gap-3">
                        <h1>
                            Do you want delete {selectProductInTable.length}{' '}
                            products ?
                        </h1>
                        <ButtonModal
                            handleYes={() => {
                                handleButtonDeleteMany();
                            }}
                            handleNo={() => {
                                setShowModalDeleteMany(false);
                            }}
                        />
                    </div>
                </Modal>
            )}
            <div className="relative">
                {(getProductsQuery?.isLoading ||
                    getProductsQuery?.isFetching) && <Loading />}
                <DataTable
                    columns={columns}
                    data={products}
                    pageCount={getProductsQuery?.data?.pageCount}
                    isLoading={getProductsQuery?.isLoading}
                />
                <Pagination
                    page={page || 1}
                    pageCount={pageCount || 1}
                    handleEvent={(data) => handlePageClick(data)}
                />
            </div>
        </AccountTemplate>
    );
};

export default AllProduct;
