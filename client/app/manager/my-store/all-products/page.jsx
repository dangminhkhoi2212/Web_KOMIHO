'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import { getUserId } from '@/redux/selector';
import {
    deleteManyProducts,
    deleteProduct,
    getProductsByUserId,
} from '@/services/product.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import routes from '@/routes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';

const AllProduct = () => {
    const userId = useSelector(getUserId);

    const [showModal, setShowModel] = useState(false);
    const queryClient = useQueryClient();

    const [checked, setChecked] = useState(false);
    const [listChose, setListChose] = useState([]);
    console.log('🚀 ~ file: page.jsx:28 ~ AllProduct ~ listChose:', listChose);

    console.log('🚀 ~ file: page.jsx:26 ~ AllProduct ~ checked:', checked);
    const getProducts = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            return await getProductsByUserId({ userId });
        },
    });
    const handleDeleteProduct = useMutation({
        mutationFn: async (productId) => {
            setShowModel(false);
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

    const checkAllChecked = listChose.length === getProducts.data?.length;

    const handleSelectOneProduct = (productId) => {
        const existed = listChose.some((id) => id === productId);
        if (existed) {
            setListChose((pre) => pre.filter((id) => id !== productId));
        } else {
            setListChose((pre) => [...pre, productId]);
        }
    };

    useEffect(() => {
        if (checked) {
            console.log('chose');
            setListChose(getProducts.data.map((product) => product._id));
        } else {
            setListChose([]);
        }
    }, [checked]);

    const handelDeleteManyProducts = useMutation({
        mutationFn: async () => {
            if (listChose.length === 0) {
                throw { message: "Haven't any products is selected" };
            }
            setShowModel(false);

            return await deleteManyProducts(listChose);
        },
        onSuccess(data) {
            if (data.ok) {
                queryClient.invalidateQueries(['products']);
                toast.success('Delete products successfully.');
                setChecked(false);
                setShowModel(false);
            }
        },
        onError(error) {
            setShowModel(false);
            if (error.message == "Haven't any products is selected") {
                toast.warning("Haven't any products is selected");
                return;
            }
            toast.error(
                error?.response?.data?.message || 'Delete products failed',
            );
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
                            setShowModel({ deleteManyProducts: true });
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
                handelDeleteManyProducts.isLoading) && <Loading />}

            {showModal && (
                <Modal
                    showModel={true}
                    handleEvent={() => setShowModel(false)}
                    label={'Delete product'}>
                    <div className="text-center">
                        <h3 className=" my-2">
                            {showModal.deleteManyProducts ? (
                                <span>
                                    Are you sure you want to delete products are
                                    selected ?
                                </span>
                            ) : (
                                <>
                                    <span>
                                        Are you sure you want to delete product
                                        has ID:{' '}
                                    </span>
                                    <span className="font-medium">
                                        {showModal}?
                                    </span>
                                </>
                            )}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => {
                                    if (showModal.deleteManyProducts) {
                                        handelDeleteManyProducts.mutate();
                                    } else
                                        handleDeleteProduct.mutate(showModal);
                                }}>
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowModel(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {getProducts.data?.length == 0 ? (
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
                <>
                    <table className="w-full table-auto flex flex-col gap-3">
                        <thead className="border-b-2 pb-2">
                            <tr className="grid grid-cols-12">
                                <th className="col-span-1">
                                    <input
                                        type="checkbox"
                                        name="productId"
                                        className="rounded-md w-5 h-5 mr-2"
                                        id="all"
                                        checked={checkAllChecked}
                                        onChange={() => {
                                            setChecked(!checked);
                                        }}
                                    />
                                    <label htmlFor="all">All</label>
                                </th>
                                <th className="col-span-6">ITEM</th>
                                <th className="col-span-2">PRICE</th>
                                <th className="col-span-1">STORE</th>
                                <th className="col-span-2">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="flex flex-col gap-3">
                            {getProducts.data?.map((product) => {
                                return (
                                    <tr
                                        key={product._id}
                                        className="grid grid-cols-12 place-items-center gap-4">
                                        <td className="col-span-1">
                                            <input
                                                type="checkbox"
                                                checked={listChose.some(
                                                    (id) => id === product._id,
                                                )}
                                                value={product._id}
                                                onChange={() =>
                                                    handleSelectOneProduct(
                                                        product._id,
                                                    )
                                                }
                                                className="rounded-md w-5 h-5"
                                            />
                                        </td>
                                        <td className=" col-span-6 flex gap-3 items-center place-self-start">
                                            <div className="relative w-[60px] h-[60px] ">
                                                <Image
                                                    src={product.images[0].url}
                                                    fill={true}
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
                                            {product.price.final}
                                        </td>
                                        <td className="col-span-1">
                                            {product.store}
                                        </td>
                                        <td className="col-span-2">
                                            <div className="flex gap-3 items-start text-white">
                                                <button>
                                                    <FiEdit2 className="h-8 w-8  p-2 rounded-xl bg-green-400 shadow-md shadow-green-400 hover:shadow-lg hover:shadow-green-400" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShowModel(
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
        </AccountTemplate>
    );
};

export default AllProduct;
