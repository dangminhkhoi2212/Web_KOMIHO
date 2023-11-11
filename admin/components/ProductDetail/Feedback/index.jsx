import FeedbackContent from '@/components/Feedback/FeedbackContent';
import Loading from '@/components/Loading';
import { getFeedback } from '@/services/feedback.service';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { List } from 'lucide-react';

const Feedback = ({ productId }) => {
    const searchParams = useSearchParams();
    const stars = searchParams.get('stars');
    const getFeedbacksQuery = useQuery({
        queryKey: ['product-detail-feedbacks'],
        queryFn: () => {
            return getFeedback({ productId, stars });
        },
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        getFeedbacksQuery.refetch();
    }, [stars]);
    const feedbacks = getFeedbacksQuery?.data;
    return (
        <div className="relative">
            {(getFeedbacksQuery.isLoading || getFeedbacksQuery.isFetching) && (
                <Loading />
            )}
            {feedbacks?.length ? (
                <div className="flex flex-col gap-3">
                    {feedbacks?.map((feedback, index) => (
                        <div key={feedback._id}>
                            <FeedbackContent feedback={feedback} />
                            {index < feedbacks.length - 1 && (
                                <hr className="my-2" />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-52 gap-2">
                    <List className="w-12 h-12" />
                    <Badge color={'indigo'} size={'xl'}>
                        No feedback yet
                    </Badge>
                </div>
            )}
        </div>
    );
};

export default Feedback;
