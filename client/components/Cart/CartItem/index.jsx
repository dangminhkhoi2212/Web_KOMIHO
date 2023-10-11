'use client';
import AvatarText from '@/components/Avatar';
import Modal from '@/components/Modal';
import FormEditCartItem from '@/components/Cart/FormEditCartItem';
import routes from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getProductCartItem, getCartList, getUserId } from '@/redux/selector';
import { NumericFormat } from 'react-number-format';
import clsx from 'clsx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import {
    clickOnProductInCart,
    clickOnSellerProductInCart,
    setCartLength,
} from '@/redux/cartSlice';
import Loading from '@/components/Loading';
import { deleteCart } from '@/services/cart.service';
import { Badge } from 'flowbite-react';

const CartItem = ({ seller, productsProp }) => {
    const selectProductInCart = useSelector(getCartList);
    const [products, setProducts] = useState(productsProp);
    const userId = useSelector(getUserId);
    const dispatch = useDispatch();
    const [chooseCartItem, setChooseCartItem] = useState(null);
    const queryClient = useQueryClient();
    const [sellerChecked, setSellerChecked] = useState(false);
    useEffect(() => {
        setProducts(productsProp);
    }, [productsProp]);
    const deleteOneProductMutation = useMutation({
        mutationFn: (cartIds) => {
            return deleteCart({ userId, cartIds });
        },
        onSuccess(data) {
            queryClient.invalidateQueries(['cart']);
            dispatch(setCartLength({ cartLength: data.cartLength }));
        },
        onError(error) {
            toast.error(
                error?.response?.data?.message ||
                    'Delete failed. Please try again.',
            );
        },
    });

    const handleDeleteOneProduct = (cartItemId) => {
        deleteOneProductMutation.mutate([cartItemId]);
    };

    const handleClickOnSeller = (e) => {
        const checked = e.target.checked;
        dispatch(clickOnSellerProductInCart({ sellerId: seller._id, checked }));
    };

    const handleClickOnCartItem = (e, cartItem) => {
        const checked = e.target.checked;

        dispatch(
            clickOnProductInCart({
                cartItemId: cartItem._id,
                checked,
                select: cartItem.select,
            }),
        );
    };
    const checkSeller = () => {
        const findSeller = selectProductInCart?.filter(
            (cartItem) => cartItem.productId.userId._id === seller._id,
        );
        return findSeller.every((cartItem) => cartItem.checked === true);
    };
    useEffect(() => {
        setSellerChecked(() => checkSeller());
    }, [checkSeller()]);

    if (!products) return <></>;
    return (
        <div className=" px-5 py-4 rounded-md  bg-white flex flex-col gap-5 relative">
            {deleteOneProductMutation?.isLoading && <Loading />}

            {chooseCartItem && (
                <Modal
                    label={'EDIT SELECTION'}
                    handleEvent={() => {
                        setChooseCartItem(false);
                    }}>
                    <p className="mb-3 font-medium">
                        {chooseCartItem.product.name}
                    </p>
                    <FormEditCartItem
                        cartItem={chooseCartItem}
                        handleEvent={() => setChooseCartItem(null)}
                    />
                </Modal>
            )}
            <div className="grid grid-cols-12 ">
                <div className="col-span-1 flex justify-center items-center ">
                    <input
                        type="checkbox"
                        name="cart-item"
                        id=""
                        onChange={(e) => {
                            handleClickOnSeller(e);
                        }}
                        checked={sellerChecked}
                        className="rounded-sm w-5 h-5 checked:bg-primary border-2 border-gray-200"
                    />
                </div>
                <div className="col-span-5 place-self-start">
                    <Link href={routes.store(seller?._id)}>
                        <AvatarText
                            src={seller?.avatar?.url}
                            name={seller?.name}
                        />
                    </Link>
                </div>
            </div>
            <div className="ring-1 ring-gray-200 rounded-md">
                {products?.map(({ _id, productId, select, checked }, index) => (
                    <div key={_id} className="relative">
                        <div className="grid grid-cols-12 rounded-md items-center py-2 place-items-center">
                            <div className="col-span-1 flex justify-center items-center ">
                                <input
                                    type="checkbox"
                                    name="cart-item"
                                    id="cartItem"
                                    checked={
                                        selectProductInCart?.find(
                                            (cartItem) => cartItem._id === _id,
                                        )?.checked || false
                                    }
                                    onChange={(e) =>
                                        handleClickOnCartItem(e, {
                                            _id,
                                            checked,
                                            select,
                                        })
                                    }
                                    className="rounded-sm w-5 h-5 checked:bg-primary border-2 border-gray-200"
                                />
                            </div>
                            <Link
                                href={routes.productDetail(productId._id)}
                                className="col-span-4 place-self-start flex gap-3">
                                <div className="w-[80px] h-[80px] overflow-hidden ring-1 ring-gray-200 relative rounded-md">
                                    <Image
                                        src={productId?.images[0]?.url}
                                        alt={productId?.name}
                                        fill
                                        sizes="80px"
                                        className="object-contain object-center "
                                    />
                                </div>
                                <div className="text-sm line-clamp-3">
                                    {productId?.name}
                                </div>
                            </Link>
                            <div className="col-span-2 flex gap-3 items-start text-xs">
                                <div className="inline-flex flex-col  gap-2">
                                    <NumericFormat
                                        value={productId?.price?.origin}
                                        thousandSeparator
                                        displayType="text"
                                        suffix={' VND'}
                                        renderText={(value) => (
                                            <span
                                                className={clsx(
                                                    productId?.price
                                                        ?.percent !== 0
                                                        ? 'line-through'
                                                        : '',
                                                )}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                    {!!productId?.price?.percent && (
                                        <NumericFormat
                                            value={productId?.price?.final}
                                            thousandSeparator
                                            displayType="text"
                                            suffix={' VND'}
                                            renderText={(value) => (
                                                <span className="font-medium">
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    )}
                                </div>
                                {!!productId?.price?.percent && (
                                    <Badge color={'red'}>
                                        {productId?.price?.percent}% OFF
                                    </Badge>
                                )}
                            </div>
                            <div className="col-span-3 ">
                                <button
                                    className="flex gap-5 text-sm ring-1 ring-gray-200 px-3 py-2 rounded-md hover:bg-primary/20 hover:ring-0 "
                                    type="button"
                                    onClick={() => {
                                        setChooseCartItem({
                                            cartId: _id,
                                            product: productId,
                                            select,
                                        });
                                        // dispatch(
                                        //     setCartItem({
                                        //         product: productId,
                                        //         cartItemId: _id,
                                        //         select,
                                        //     }),
                                        // );
                                    }}>
                                    <span className="flex flex-col gap-1">
                                        <span className="font-semibold">
                                            Color
                                        </span>
                                        <span>{select.color}</span>
                                    </span>
                                    <span className="flex flex-col gap-1">
                                        <span className="font-semibold">
                                            Size
                                        </span>
                                        <span>{select.size}</span>
                                    </span>
                                    <span className="flex flex-col gap-1">
                                        <span className="font-semibold">
                                            Quantity
                                        </span>
                                        <span>{select.quantity}</span>
                                    </span>
                                </button>
                            </div>

                            <div className="col-span-1 text-xs font-bold">
                                <NumericFormat
                                    value={
                                        productId?.price?.final *
                                        select.quantity
                                    }
                                    thousandSeparator
                                    displayType="text"
                                    suffix={' VND'}
                                    renderText={(value) => (
                                        <span className="">{value}</span>
                                    )}
                                />
                            </div>
                            <div className="col-span-1 ">
                                <button
                                    className="hover:ring-1 hover:rounded-md p-2"
                                    onClick={() => handleDeleteOneProduct(_id)}
                                    disabled={
                                        deleteOneProductMutation?.isLoading
                                    }>
                                    <RiDeleteBin6Line className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        {index < products.length - 1 && <hr />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartItem;
