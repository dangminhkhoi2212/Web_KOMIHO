'use client';
import Link from 'next/link';
import routes from '@/routes';
import dynamic from 'next/dynamic';
import {
    getChooseProduct,
    getChooseStatus,
    getFilter,
    getLimitFilter,
    getPageFilter,
    getPriceFilter,
    getSelectProductInTable,
    getStoreFilter,
    getUserId,
} from '@/redux/selector';
import {
    deleteManyProducts,
    deleteProduct,
    getProductsByUserId,
} from '@/services/product.service';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5';
import { Button } from 'flowbite-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const ProductTemplate = dynamic(() =>
    import('@/components/Product/ProductTemplateTable'),
);

const AccountTemplate = dynamic(() =>
    import('@/components/Account/AccountTemplate'),
);
const Loading = dynamic(() => import('@/components/Loading'));
const Modal = dynamic(() => import('@/components/Modal'));

import { Payment, columns } from '@/components/Shadcn/Table/columns';
import { DataTable } from '@/components/Shadcn/Table/data-table';
import { formatPrice } from '@/utils/format';
import FormEditProduct from '@/components/Product/FormEditProduct';
import Image from 'next/image';
import { removeChooseProduct } from '@/redux/chooseProductSlice';
import { resetSelectProductInTable } from '@/redux/selectProductInTable';
const AllProduct = () => {
    const userId = useSelector(getUserId);
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [listChose, setListChose] = useState([]);

    const price = useSelector(getPriceFilter);
    const store = useSelector(getStoreFilter);
    const page = useSelector(getPageFilter);
    const limit = useSelector(getLimitFilter);

    const chooseProduct = useSelector(getChooseProduct);
    const chooseStatus = useSelector(getChooseStatus);

    const [modalDeleteMany, setShowModalDeleteMany] = useState(false);
    const dispatch = useDispatch();

    const getProducts = useQuery({
        queryKey: ['products'],
        queryFn: () => {
            return getProductsByUserId({
                userId,
                price,
                store,
                page,
                limit,
            });
        },
        refetchOnWindowFocus: false,
    });

    const handleDeleteProduct = useMutation({
        mutationKey: ['products'],
        mutationFn: (productId) => {
            return deleteProduct(productId);
        },
        onSuccess(data) {
            if (data.status == 'success') {
                toast.success('Product deleted successfully.');
                setShowModal(false);
                queryClient.invalidateQueries(['products']);
            }
        },
        onError(error) {
            toast.error('Product delete failed. Please try again.');
        },
    });

    const deleteManyProductsMutation = useMutation({
        mutationFn: (productIds) => {
            return deleteManyProducts(productIds);
        },
        onSuccess(data) {
            if (data.ok) {
                dispatch(removeChooseProduct());
                queryClient.invalidateQueries(['products']);
                toast.success('Delete products successfully.');
                setShowModal(false);
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
            return;
        }
        deleteManyProductsMutation.mutate(selectProductInTable);
    };
    const dataTable = getProducts?.data?.products;
    if (!dataTable) return;
    return (
        <AccountTemplate
            title={'ALL PRODUCTS'}
            note={'Edit all your products'}
            button={
                <div className="flex gap-5">
                    <button
                        onClick={() => {
                            setShowModalDeleteMany(true);
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
            {/* //     {(handleDeleteProduct.isLoading ||
        //         getProducts.isLoading ||
        //         getProducts.isFetching ||
        //         deleteManyProductsMutation.isLoading) && <Loading />}

        //     {showModal && (
        //         <Modal
        //             label={'DELETE MANY'}
        //             handleEvent={() => setShowModal(false)}>
        //             {deleteManyProductsMutation.isLoading && (
        //                 <Loading sizeProp={60} />
        //             )}
        //             <div className="text-center">
        //                 <h3 className=" my-2">
        //                     <span>
        //                         Do you want to delete products you have
        //                         selected?{' '}
        //                     </span>
        //                 </h3>
        //                 <div className="flex justify-center gap-4">
        //                     <Button
        //                         color="failure"
        //                         onClick={() => {
        //                             deleteManyProductsMutation.mutate(listChose);
        //                         }}>
        //                         Yes, I'm sure
        //                     </Button>
        //                     <Button
        //                         color="gray"
        //                         onClick={() => setShowModal(false)}>
        //                         No, cancel
        //                     </Button>
        //                 </div>
        //             </div>
        //         </Modal>
        //     )}
        //     {getProducts.data?.products && (
        //         <ProductTemplate
        //             listChose={listChose}
        //             setListChose={setListChose}
        //         />
        //     )} */}
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
                            <span>{chooseProduct.name}</span>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => {
                                    deleteManyProductsMutation.mutate([
                                        chooseProduct._id,
                                    ]);
                                }}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => handleCancel()}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {modalDeleteMany && (
                <Modal
                    label={'DELETE MANY'}
                    handleEvent={() => setShowModalDeleteMany(false)}>
                    <div className="flex flex-col items-center gap-3">
                        <h1>
                            Do you want delete {selectProductInTable.length}{' '}
                            products ?
                        </h1>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => {
                                    handleButtonDeleteMany();
                                }}>
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => {
                                    setShowModalDeleteMany(false);
                                }}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className="container mx-auto">
                <DataTable columns={columns} data={dataTable} />
            </div>
        </AccountTemplate>
    );
};

export default AllProduct;
