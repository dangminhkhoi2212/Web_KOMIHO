'use client';

import { setCartLength } from '@/redux/cartSlice';
import { getCartLength, getUserId } from '@/redux/selector';
import routes from '@/routes';
import { getCart } from '@/services/cart.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TfiShoppingCartFull } from 'react-icons/tfi';
import { useDispatch, useSelector } from 'react-redux';
const Cart = () => {
    const userId = useSelector(getUserId);
    const [lengthCartItem, setLengthCartItem] = useState(0);
    const cartLength = useSelector(getCartLength);
    const getCartsQuery = useQuery({
        queryKey: ['cart-length'],
        queryFn: () => {
            return getCart({ userId, getLength: 'yes' });
        },
        enabled: !!userId,
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            setCartLength({
                cartLength: getCartsQuery?.data?.cartLength,
            }),
        );
    }, [getCartsQuery?.data?.cartLength]);

    useEffect(() => {
        setLengthCartItem(cartLength);
    }, [cartLength]);
    return (
        <Link
            href={routes.cart}
            role="button"
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white hover:ring-2 outline-none hover:ring-blue-300 rounded-md">
            <TfiShoppingCartFull className="font-medium text-xl text-black" />
            <span className="sr-only">Notifications</span>
            {lengthCartItem && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                    {lengthCartItem}
                </div>
            )}
        </Link>
    );
};

export default Cart;
