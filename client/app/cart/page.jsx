'use client';
import { getSelectProductInCart, getUserId } from '@/redux/selector';
import { getCartsByUserId } from '@/services/cart.service';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '@/components/Cart/CartItem';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { NumericFormat } from 'react-number-format';
import {
    addSelectProductInCart,
    resetSelectProductInCart,
} from '@/redux/selectProductInCart';
import Total from '@/components/Cart/Total';

const Cart = () => {
    const userId = useSelector(getUserId);
    const [cartItems, setCartItems] = useState([]);
    const [checked, setChecked] = useState(false);
    const selectProductInCart = useSelector(getSelectProductInCart);
    const dispatch = useDispatch();
    const cartsQuery = useQuery({
        queryKey: ['carts'],
        queryFn: () => {
            return getCartsByUserId(userId);
        },
    });
    useEffect(() => {
        setCartItems(cartsQuery?.data);
    }, [cartsQuery?.data]);

    useEffect(() => {
        return () => dispatch(resetSelectProductInCart());
    }, []);

    const allCartItems = useMemo(() => {
        const arr = [];

        cartsQuery?.data?.forEach((cart) => {
            arr.push(...cart.products);
        });
        return arr;
    }, [cartsQuery]);
    const handleOnClickAll = (e) => {
        const checked = e.target.checked;
        if (checked) {
            dispatch(addSelectProductInCart(allCartItems || []));
            setChecked(true);
        } else {
            dispatch(resetSelectProductInCart());
            setChecked(false);
        }
    };

    useEffect(() => {
        setChecked(selectProductInCart.length === allCartItems.length);
    }, [selectProductInCart, allCartItems]);

    return (
        <div className="px-20 flex flex-col gap-5 relative ">
            <div className="grid grid-cols-12 px-5 py-4 rounded-md bg-white">
                <div className="col-span-1 flex justify-center items-center ">
                    <input
                        type="checkbox"
                        name="cart-item"
                        checked={checked}
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
                <>
                    {cartsQuery.isLoading && <Loading />}
                    {cartItems?.map((cartItem) => (
                        <div key={cartItem._id}>
                            <CartItem
                                seller={cartItem.sellerId}
                                products={cartItem.products}
                                cartId={cartItem._id}
                            />
                        </div>
                    ))}
                </>
            )}

            <Total />
        </div>
    );
};

export default Cart;
