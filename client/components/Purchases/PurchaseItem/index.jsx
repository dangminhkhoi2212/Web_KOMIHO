import { CiShop } from 'react-icons/ci';
import Product from './Product';
import { Badge, Button } from 'flowbite-react';
import { NumericFormat } from 'react-number-format';
import { convertISO } from '@/utils/date';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '@/services/order.service';
import { toast } from 'react-toastify';
import Link from 'next/link';
import routes from '@/routes';
import Modal from '@/components/Modal';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';

const statusList = [
    { name: 'Pending', value: 'pending', color: 'warning' },
    { name: 'Cancelled', value: 'cancelled', color: 'failure' },
    { name: 'Delivering', value: 'delivering', color: 'indigo' },
    { name: 'Delivered', value: 'delivered', color: 'success' },
];
const PurchaseItem = ({ purchase, isManager }) => {
    console.log('🚀 ~ file: index.jsx:23 ~ PurchaseItem ~ purchase:', purchase);
    const customer = isManager ? purchase.userId : purchase.sellerId;
    const items = purchase.items;
    const status = purchase.status;
    const userId = useSelector(getUserId);
    const queryClient = useQueryClient();
    const cancelMutation = useMutation({
        mutationFn: () => {
            return updateOrder({ orderId: purchase._id, status: 'cancelled' });
        },
        onSuccess(data) {
            if (data.ok) {
                queryClient.invalidateQueries(['order']);
            }
        },
        onError(err) {
            toast.error('This order can not cancelled.');
        },
    });
    const acceptMutation = useMutation({
        mutationFn: () => {
            return updateOrder({ orderId: purchase._id, status: 'delivering' });
        },
        onSuccess(data) {
            if (data.ok) {
                queryClient.invalidateQueries(['order']);
            }
        },
        onError(err) {
            toast.error('This order can not accept.');
        },
    });
    const receiveMutation = useMutation({
        mutationFn: () => {
            return updateOrder({ orderId: purchase._id, status: 'delivered' });
        },
        onSuccess(data) {
            if (data.ok) {
                queryClient.invalidateQueries(['order']);
            }
        },
        onError(err) {
            toast.error(
                'This order can not delivered. Please click receive again.',
            );
        },
    });
    return (
        <div className="flex flex-col gap-3 px-5 py-4 rounded-md bg-white">
            <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 ">
                    <span className="font-medium">{customer?.name}</span>
                    <Link
                        href={routes.store(customer._id)}
                        className="flex gap-1 items-center px-1 rounded ring-1 ring-gray-200">
                        <CiShop />
                        View
                    </Link>
                </div>
                {statusList.map((status) => {
                    if (status.value === purchase.status)
                        return (
                            <Badge color={status.color} key={status.name}>
                                {status.name}
                            </Badge>
                        );
                })}

                {status === 'pending' && (
                    <div className="flex gap-2">
                        {status === 'pending' && (
                            <Button
                                color="red"
                                size="xs"
                                isProcessing={cancelMutation.isLoading}
                                onClick={() => {
                                    cancelMutation.mutate();
                                }}>
                                Cancel
                            </Button>
                        )}
                        {isManager && purchase.status === 'pending' && (
                            <Button
                                isProcessing={acceptMutation.isLoading}
                                color="teal"
                                size="xs"
                                onClick={() => acceptMutation.mutate()}>
                                Accept
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <hr />
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div key={index}>
                        <Product item={item} />
                        {index < items.length - 1 && <hr />}
                    </div>
                ))}
            </div>
            <div className="border-t-2 border-gray-200 border-dashed py-2 flex justify-between items-center">
                <div className="text-sm">
                    <p>
                        <span className="font-medium">Order date: </span>
                        {convertISO(purchase?.orderDate)}
                    </p>
                    {purchase?.deliveredDate && (
                        <p>
                            <span className="font-medium">Expected date: </span>
                            {convertISO(purchase?.deliveredDate)}
                        </p>
                    )}
                    {isManager ? (
                        <div>
                            <p>{purchase?.userId?.address?.pickup?.main}</p>
                            <p>{purchase?.userId?.address?.pickup?.sub}</p>
                            <p>{purchase?.userId?.phone}</p>
                        </div>
                    ) : (
                        <div>
                            <p>{purchase?.sellerId?.address?.store?.main}</p>
                            <p>{purchase?.sellerId?.address?.store?.sub}</p>
                            <p>{purchase?.sellerId?.phone}</p>
                        </div>
                    )}
                </div>
                <NumericFormat
                    value={purchase.total}
                    thousandSeparator
                    displayType="text"
                    suffix={' VND'}
                    renderText={(value) => (
                        <span className="font-medium float-right">
                            <span>Order total: </span>
                            <span className="text-red-500">{value}</span>
                        </span>
                    )}
                />
                {status === 'delivering' &&
                    userId === purchase?.userId?._id && (
                        <Button
                            color="green"
                            isProcessing={receiveMutation.isLoading}
                            onClick={() => receiveMutation.mutate()}>
                            Receive
                        </Button>
                    )}
                {status === 'delivered' && userId === purchase?.userId?._id && (
                    <Link href={routes.feedback(purchase._id)}>
                        <Button className="bg-primary/80 hover:!bg-primary !ring-0 !border-0">
                            Feedback
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default memo(PurchaseItem);
