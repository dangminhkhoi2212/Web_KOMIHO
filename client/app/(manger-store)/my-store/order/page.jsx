'use client';
import AccountTemplate from '@/components/Account/AccountTemplate';
import Loading from '@/components/Loading';
import MenuBar from '@/components/MenuBar';
import PurchaseItem from '@/components/Purchases/PurchaseItem';
import { getUserId } from '@/redux/selector';
import routes from '@/routes';
import { getOrder } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { LuClipboardList } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const tabs = [
    { name: 'All', tab: 'all', active: true },
    {
        name: 'Pending',
        tab: 'pending',
        active: false,
    },
    {
        name: 'Cancelled',
        tab: 'cancelled',
        active: false,
    },
    {
        name: 'Delivering',
        tab: 'delivering',
        active: false,
    },
    {
        name: 'Delivered',
        tab: 'delivered',
        active: false,
    },
    {
        name: 'Delivery failed',
        tab: 'delivery-failed',
        active: false,
    },
];
const OrderManagement = () => {
    const router = useRouter();
    const userId = useSelector(getUserId);
    const status = useSearchParams().get('status');

    const getOrderQuery = useQuery({
        queryKey: ['order', status],
        queryFn: () => {
            return getOrder({ sellerId: userId, status });
        },
    });

    const handleSelectTab = (tab) => {
        const query =
            tab === 'all'
                ? `${routes.managerOrder}`
                : `${routes.managerOrder}?status=${tab}`;

        router.replace(query);
    };
    return (
        <div className="flex flex-col gap-3">
            <AccountTemplate title={'ORDER MANAGEMENT'}>
                <MenuBar
                    list={tabs}
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
                            isManager={true}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default OrderManagement;
