'use client';
import Link from 'next/link';
import routes from '@/routes';
import dynamic from 'next/dynamic';
import {
    getFilter,
    getLimitFilter,
    getPageFilter,
    getPriceFilter,
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
const AllProduct = () => {
    const userId = useSelector(getUserId);
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [listChose, setListChose] = useState([]);

    const price = useSelector(getPriceFilter);
    const store = useSelector(getStoreFilter);
    const page = useSelector(getPageFilter);
    const limit = useSelector(getLimitFilter);

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

    const handelDeleteManyProducts = useMutation({
        mutationFn: () => {
            if (listChose.length === 0) {
                throw 'No products selected';
            }
            return deleteManyProducts(listChose);
        },
        onSuccess(data) {
            if (data.ok) {
                queryClient.invalidateQueries(['products']);
                toast.success('Delete products successfully.');
                setShowModal(false);
            }
        },
        onError(error) {
            setShowModal(false);
            const errorMessage = error.message || 'Delete products failed';
            toast.warning(errorMessage);
        },
    });

    return (
        <AccountTemplate
            title={'ALL PRODUCTS'}
            note={'Edit all your products'}
            button={
                <div className="flex gap-5">
                    <button
                        onClick={() => {
                            setShowModal(true);
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
            {(handleDeleteProduct.isLoading ||
                getProducts.isLoading ||
                getProducts.isFetching ||
                handelDeleteManyProducts.isLoading) && <Loading />}

            {showModal && (
                <Modal
                    label={'DELETE MANY'}
                    handleEvent={() => setShowModal(false)}>
                    {handelDeleteManyProducts.isLoading && (
                        <Loading sizeProp={60} />
                    )}
                    <div className="text-center">
                        <h3 className=" my-2">
                            <span>
                                Do you want to delete products you have
                                selected?{' '}
                            </span>
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => {
                                    handelDeleteManyProducts.mutate(listChose);
                                }}>
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {getProducts.data?.products && (
                <ProductTemplate
                    listChose={listChose}
                    setListChose={setListChose}
                />
            )}
        </AccountTemplate>
    );
};

export default AllProduct;
