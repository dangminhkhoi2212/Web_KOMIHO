'use client';
import { getUserId } from '@/redux/selector';
import { getCartsByUserId } from '@/services/cart.service';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CartItem from '@/components/Cart/CartItem';

const Cart = () => {
    const userId = useSelector(getUserId);
    const [cartItems, setCartItems] = useState([]);
    console.log('🚀 ~ file: page.jsx:12 ~ Cart ~ cartItems:', cartItems);
    const cartsQuery = useQuery({
        queryKey: ['carts'],
        queryFn: () => {
            return getCartsByUserId(userId);
        },
    });
    useEffect(() => {
        setCartItems(cartsQuery?.data);
    }, [cartsQuery?.data]);
    return (
        <div className="px-10 flex flex-col gap-5">
            <div className="grid grid-cols-12 px-5 py-4 rounded-md bg-white">
                <div className="col-span-1">f</div>
                <div className="col-span-6">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-1">Actions</div>
            </div>
            {cartItems.map((cartItem) => (
                <div key={cartItem._id}>
                    <CartItem seller={cartItem.sellerId} />
                </div>
            ))}
        </div>
    );
};

export default Cart;
