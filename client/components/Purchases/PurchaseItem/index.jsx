import { CiShop } from 'react-icons/ci';
import Product from './Product';
import { Badge, Button } from 'flowbite-react';
import { NumericFormat } from 'react-number-format';
import { convertISO } from '@/utils/date';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '@/services/order.service';
import { toast } from 'react-toastify';

const statusList = [
    { name: 'Pending', value: 'pending', color: 'warning' },
    { name: 'Cancelled', value: 'cancelled', color: 'failure' },
    { name: 'Delivering', value: 'delivering', color: 'indigo' },
    { name: 'Delivered', value: 'delivered', color: 'success' },
];
const PurchaseItem = ({ purchase, isManager }) => {
    const customer = isManager ? purchase.userId : purchase.sellerId;
    const items = purchase.items;
    const status = purchase.status;
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
                    <span className="flex gap-1 items-center px-1 rounded ring-1 ring-gray-200">
                        <CiShop />
                        View
                    </span>
                </div>
                {statusList.map((status) => {
                    if (status.value === purchase.status)
                        return (
                            <Badge color={status.color} key={status.name}>
                                {status.name}
                            </Badge>
                        );
                    return <></>;
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
                    <>
                        <Product item={item} key={index} />
                        {index < items.length - 1 && <hr />}
                    </>
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
                {status === 'delivering' && (
                    <Button
                        color="green"
                        isProcessing={receiveMutation.isLoading}
                        onClick={() => receiveMutation.mutate()}>
                        Receive
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PurchaseItem;
