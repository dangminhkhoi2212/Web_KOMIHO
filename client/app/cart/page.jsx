'use client';
import { getCartList, getUserId } from '@/redux/selector';
import { getCart } from '@/services/cart.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
    clickAllSelectProductsInCart,
    initSelectProductInCart,
    resetSelectProductInCart,
} from '@/redux/cartSlice';
import Total from '@/components/Cart/Total';
import Loading from './loading';
import { resetCheckOut } from '@/redux/checkoutSlice';

const Cart = () => {
    const userId = useSelector(getUserId);
    const [cartItems, setCartItems] = useState([]);

    const selectProductInCart = useSelector(getCartList);

    const dispatch = useDispatch();
    const getCartsQuery = useQuery({
        queryKey: ['cart'],
        queryFn: () => {
            return getCart({ userId });
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!getCartsQuery?.data) return;

        setCartItems(getCartsQuery?.data);
        const data = getCartsQuery?.data.map((cart) => cart.products);
        dispatch(initSelectProductInCart(data.flat()));
    }, [getCartsQuery?.data]);

    const handleOnClickAll = (e) => {
        const checked = e.target.checked;
        dispatch(clickAllSelectProductsInCart({ checked }));
    };

    return (
        <div className="px-20 flex flex-col gap-5 relative ">
            {getCartsQuery.isLoading ||
                (getCartsQuery.isFetching && <LoadingCpn />)}
            <div className="grid grid-cols-12 px-5 py-4 rounded-md bg-white place-items-center">
                <div className="col-span-1 flex justify-center items-center ">
                    <input
                        type="checkbox"
                        checked={
                            selectProductInCart?.every(
                                (cartItem) => cartItem.checked === true,
                            ) && selectProductInCart.length !== 0
                        }
                        name="cart-item"
                        onChange={(e) => handleOnClickAll(e)}
                        className="rounded-sm w-5 h-5 checked:bg-primary border-2 border-gray-200"
                    />
                </div>
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-3">Select</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-1">Actions</div>
            </div>
            {cartItems?.length === 0 ? (
                <p className="text-center font-semibold h-[200px]">
                    Empty cart
                </p>
            ) : (
                <Suspense fallback={<Loading />}>
                    {getCartsQuery.isLoading && <Loading />}
                    {cartItems?.map((cartItem, index) => (
                        <div key={index}>
                            <CartItem
                                seller={cartItem._id.sellerId}
                                productsProp={cartItem.products}
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
