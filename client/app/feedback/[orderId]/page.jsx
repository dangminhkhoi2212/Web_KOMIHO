'use client';

import FeedbackForm from '@/components/Feedback/FeedbackForm';
import InfoProduct from '@/components/Feedback/InfoProduct';
import { getOrder } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';

const feedback = ({ params }) => {
    const { orderId } = params;
    const getPurchaseQuery = useQuery({
        queryKey: ['order-items'],
        queryFn: () => {
            return getOrder({ orderId });
        },
        refetchOnWindowFocus: false,
    });

    if (!getPurchaseQuery?.data || !getPurchaseQuery?.data.length) return <></>;
    const data = getPurchaseQuery?.data[0] || {};
    console.log('🚀 ~ file: page.jsx:20 ~ feedback ~ data:', data);
    if (!orderId)
        return (
            <div className="flex justify-center">
                <p>orderId not found.</p>
            </div>
        );
    return (
        <div className="flex justify-center px-[10rem] flex-col gap-3">
            {data?.items?.map((item, index) => (
                <div
                    key={item._id}
                    className="bg-white rounded-md p-5 flex flex-col gap-3">
                    <InfoProduct product={item.product} select={item.select} />

                    <FeedbackForm
                        userId={data?.userId}
                        orderId={orderId}
                        sellerId={data?.sellerId?._id}
                        orderItemId={item._id}
                        productId={item.product.productId}
                    />
                </div>
            ))}
        </div>
    );
};

export default feedback;
