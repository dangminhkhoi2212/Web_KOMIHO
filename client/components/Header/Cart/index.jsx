'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { getCart } from '@/redux/selector';
import routes from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TfiShoppingCartFull } from 'react-icons/tfi';
import { useSelector } from 'react-redux';
const Cart = () => {
    const cart = useSelector(getCart);

    return (
        <Link
            href={routes.cart}
            role="button"
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white hover:ring-2 outline-none hover:ring-blue-300 rounded-md">
            <TfiShoppingCartFull className="font-medium text-xl text-black" />
            <span className="sr-only">Notifications</span>
            {cart?.length !== 0 && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                    {cart.length}
                </div>
            )}
        </Link>
    );
};

export default Cart;
