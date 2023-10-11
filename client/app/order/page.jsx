'use client';

import { Button } from 'flowbite-react';
import {
    getEmail,
    getListProductCheckOut,
    getName,
    getPhone,
    getPickupAddress,
} from '@/redux/selector';
import routes from '@/routes';
import { Badge } from 'flowbite-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderItem from '@/components/Order/OderItem';
import PlaceOrder from '@/components/Order/PlaceOrder';
import { resetCheckOut } from '@/redux/checkoutSlice';

const page = () => {
    const name = useSelector(getName);
    const email = useSelector(getEmail);
    const pickupAddress = useSelector(getPickupAddress);
    const productCheckOut = useSelector(getListProductCheckOut);
    const [cartItems, setCartItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (productCheckOut.length) {
            setCartItems(productCheckOut);
        }
    }, [productCheckOut]);

    const phone = useSelector(getPhone);

    if (!cartItems.length) {
        return (
            <div className="bg-white rounded-md p-5 mx-28">
                <Badge color={'info'} size="xl">
                    <p>You have not select a product in your shopping cart</p>
                </Badge>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 mx-28 relative">
            <div className=" bg-white rounded-md p-5">
                <h1 className="text-xl font-medium text-primary">
                    ADDRESS PICKUP
                </h1>
                <div className="flex  justify-between gap-3">
                    <div className="flex flex-col justify-center">
                        <div className="flex  gap-5 font-medium text-xl">
                            <p>{name}</p>
                            <p>{email}</p>
                            {phone ? (
                                <p>{phone}</p>
                            ) : (
                                <div className="flex gap-5 items-center justify-center">
                                    <Badge color={'failure'}>
                                        You have not phone. Please update your
                                        phone.
                                    </Badge>
                                    <Link
                                        href={routes.profile}
                                        className="flex item-center">
                                        <Button className="h-6 text-sm">
                                            Update
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        {pickupAddress ? (
                            <div className="flex flex-col text-md">
                                <p>{pickupAddress.main}</p>
                                {pickupAddress.sub && (
                                    <p>{pickupAddress.sub}</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-5">
                                <Badge color={'failure'}>
                                    You have not address pickup. Please update
                                    your address pickup.
                                </Badge>
                                <Link
                                    href={routes.address}
                                    className="flex item-center">
                                    <Button className="h-6 text-sm">
                                        Update
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        <Link href={routes.profile}>
                            <Button className="bg-primary hover:!bg-primary">
                                EDIT INFORMATION{' '}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {productCheckOut?.map((item, index) => (
                    <OrderItem orderItem={item} key={index} />
                ))}
            </div>
            <div className="sticky bottom-0 border-t-2 border-accent rounded-md">
                <PlaceOrder productCheckOut={productCheckOut} />
            </div>
        </div>
    );
};

export default page;
