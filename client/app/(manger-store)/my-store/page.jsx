'use client';
import Link from 'next/link';
import routes from '@/routes';
import dynamic from 'next/dynamic';
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
const Modal = dynamic(() => import('@/components/Modal'));
import ButtonModal from '@/components/Modal/ButtonModal';

import { Payment, columns } from '@/components/Shadcn/Table/columns';
import { DataTable } from '@/components/Shadcn/Table/data-table';
import { formatPrice } from '@/utils/format';
import FormEditProduct from '@/components/Product/FormEditProduct';
import Image from 'next/image';
import { removeChooseProduct } from '@/redux/chooseProductSlice';
import { resetSelectProductInTable } from '@/redux/selectProductInTable';
import Search from '@/components/Header/Search';
import { setPage, setTextSearch } from '@/redux/filterSearchSlice';
const AllProduct = () => {
    const userId = useSelector(getUserId);
    const queryClient = useQueryClient();

    const price = useSelector(getPriceFilter);
    const store = useSelector(getStoreFilter);
    const page = useSelector(getPageFilter);
    const limit = useSelector(getLimitFilter);
    const textSearch = useSelector(getTextSearchFilter);

    const chooseProduct = useSelector(getChooseProduct);
    const chooseStatus = useSelector(getChooseStatus);

    const [modalDeleteMany, setShowModalDeleteMany] = useState(false);
    const dispatch = useDispatch();
    const getProductsQuery = useQuery({
        queryKey: ['products', textSearch, page],
        queryFn: () => {
            return getProducts({
                userId,
                textSearch,
                page,
            });
        },
        keepPreviousData: true,
    });

    useEffect(() => {
        getProductsQuery.refetch();
    }, [textSearch, page]);
    console.log('🚀 ~ file: page.jsx:74 ~ AllProduct ~ page:', page);

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
    const selectProductInTable = useSelector(getSelectProductInTable);

    const handleButtonDeleteMany = () => {
        if (!selectProductInTable.length) {
            toast.warning('You do not choose product.');
            setShowModalDeleteMany(false);
            return;
        }
        deleteManyProductsMutation.mutate(selectProductInTable);
    };

    const handleSearch = ({ textSearch }) => {
        dispatch(setTextSearch(textSearch));
    };

    const handleRefresh = () => {
        dispatch(setTextSearch(''));
        dispatch(setPage(1));
    };
    const [dataTable, setDataTable] = useState([]);
    useEffect(() => {
        setDataTable(getProductsQuery?.data?.products);
    }, [getProductsQuery?.data]);
    if (!dataTable) return <Loading />;
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
                <Search handleEvent={(data) => handleSearch(data)} />
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
                    data={dataTable}
                    pageCount={getProductsQuery?.data?.pageCount}
                    isLoading={getProductsQuery?.isLoading}
                />
            </div>
        </AccountTemplate>
    );
};

export default AllProduct;
