'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import Loading from '@/components/Loading';
import MenuBar from '@/components/MenuBar';
const PurchaseItem = dynamic(() =>
    import('@/components/Purchases/PurchaseItem'),
);
import { getUserId } from '@/redux/selector';
import routes from '@/routes';
import { getOrder } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const navs = [
    { name: 'All', tab: 'all', active: true },
    { name: 'Pending', tab: 'pending', active: false },
    {
        name: 'Delivering',
        tab: 'delivering',
        active: false,
    },
    { name: 'Delivered', tab: 'delivered', active: false },
    { name: 'Cancelled', tab: 'cancelled', active: false },
];
const MyPurchases = () => {
    const userId = useSelector(getUserId);
    const router = useRouter();
    const status = useSearchParams().get('status');

    const getOrderQuery = useQuery({
        queryKey: ['order', status],
        queryFn: () => {
            var data = { userId };
            if (status) data = { ...data, status: status };
            return getOrder(data);
        },
    });

    const handleSelectTab = (tab) => {
        const url =
            tab === 'all'
                ? `${routes.myPurchase}`
                : `${routes.myPurchase}?status=${tab}`;
        router.replace(url);
    };
    return (
        <div className="flex flex-col gap-3">
            <AccountTemplate title={'MY PURCHASES'}>
                <MenuBar
                    list={navs}
                    handleEvent={(tab) => handleSelectTab(tab)}
                />
            </AccountTemplate>
            {!getOrderQuery?.data?.length && (
                <div className="flex justify-center items-center h-[200px] bg-white rounded-xl relative">
                    <p className="px-4 py-3  rounded-md">No orders yet</p>
                    {getOrderQuery.isLoading && <Loading />}
                </div>
            )}
            <div className="flex flex-col gap-3 ">
                {getOrderQuery?.data?.map((orderItem) => {
                    return (
                        <PurchaseItem
                            purchase={orderItem}
                            key={orderItem._id}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default MyPurchases;
