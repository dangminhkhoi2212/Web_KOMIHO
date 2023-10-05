'use client';
import { getSelectProductInCart, getUserId } from '@/redux/selector';
import { getCartsByUserId } from '@/services/cart.service';
import { useQuery } from '@tanstack/react-query';
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '@/components/Cart/CartItem';
import LoadingCpn from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { NumericFormat } from 'react-number-format';
import {
    addSelectProductInCart,
    clickAllSelectProductsInCart,
    initSelectProductInCart,
    resetSelectProductInCart,
} from '@/redux/selectProductInCart';
import Total from '@/components/Cart/Total';
import Loading from './loading';
import cartItem from '@/redux/cartItem';

const Cart = () => {
    const userId = useSelector(getUserId);
    const [cartItems, setCartItems] = useState([]);
    console.log('🚀 ~ file: page.jsx:27 ~ Cart ~ cartItems:', cartItems);
    const [checkedAll, setCheckedAll] = useState(false);
    const selectProductInCart = useSelector(getSelectProductInCart);
    console.log(
        '🚀 ~ file: page.jsx:29 ~ Cart ~ selectProductInCart:',
        selectProductInCart,
    );
    const dispatch = useDispatch();
    const getCartsQuery = useQuery({
        queryKey: ['carts'],
        queryFn: () => {
            return getCartsByUserId(userId);
        },
    });

    useEffect(() => {
        if (!getCartsQuery?.data) return;

        setCartItems(getCartsQuery?.data);
        const data = getCartsQuery?.data.map((cart) => cart.products);
        dispatch(initSelectProductInCart(data.flat()));
    }, [getCartsQuery?.data]);

    // useEffect(() => {
    //     return () => dispatch(resetSelectProductInCart());
    // }, []);

    // const allCartItems = useMemo(() => {
    //     const arr = [];

    //     getCartsQuery?.data?.forEach((cart) => {
    //         arr.push(...cart.products);
    //     });
    //     return arr;
    // }, [getCartsQuery]);
    const handleOnClickAll = (e) => {
        const checked = e.target.checked;
        dispatch(clickAllSelectProductsInCart({ checked }));
    };

    return (
        <div className="px-20 flex flex-col gap-5 relative ">
            {getCartsQuery.isLoading ||
                (getCartsQuery.isFetching && <LoadingCpn />)}
            <div className="grid grid-cols-12 px-5 py-4 rounded-md bg-white">
                <div className="col-span-1 flex justify-center items-center ">
                    <input
                        type="checkbox"
                        checked={selectProductInCart?.every(
                            (cartItem) => cartItem.checked === true,
                        )}
                        name="cart-item"
                        onChange={(e) => handleOnClickAll(e)}
                        className="rounded-sm w-5 h-5 checked:bg-primary border-2 border-gray-200"
                    />
                </div>
                <div className="col-span-6">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-1">Actions</div>
            </div>
            {cartItems?.length === 0 ? (
                <p className="text-center font-semibold h-[200px]">
                    Empty cart
                </p>
            ) : (
                <Suspense fallback={<Loading />}>
                    {getCartsQuery.isLoading && <Loading />}
                    {cartItems?.map((cartItem) => (
                        <div key={cartItem._id}>
                            <CartItem
                                seller={cartItem.sellerId}
                                productsProp={cartItem.products}
                                cartId={cartItem._id}
                            />
                        </div>
                    ))}
                </Suspense>
            )}

            <Total />
        </div>
    );
};

export default Cart;
