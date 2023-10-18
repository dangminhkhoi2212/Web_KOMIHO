'use client';

import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import StarsForm from './StarsForm';
import AvatarText from '@/components/Avatar';
import TextareaCustom from '@/components/TextareaCustom';
import { Button, Textarea } from 'flowbite-react';
import ImagesForm from './ImagesForm';
import Content from './Content';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFeedBack, getFeedback } from '@/services/feedback.service';
import { memo, useEffect, useState } from 'react';
import FeedbackContent from '../FeedbackContent';
import { uploadImages } from '@/services/image.service';

const FeedbackForm = ({ orderItemId, userId, productId, sellerId }) => {
    console.log('🚀 ~ file: index.jsx:17 ~ FeedbackForm ~ sellerId:', sellerId);
    const getFeedbackQuery = useQuery({
        queryKey: ['feedback-order-item', orderItemId],
        queryFn: () => {
            return getFeedback({ orderItemId });
        },
        refetchOnWindowFocus: false,
    });

    const data = getFeedbackQuery?.data && getFeedbackQuery?.data[0];

    const defaultValues = {
        orderItemId,
        sellerId,
        userId: userId._id,
        productId,
        images: [],
        stars: 5,
        content: '',
    };
    const methods = useForm({
        defaultValues,
    });

    const queryClient = useQueryClient();
    const createFeedbackMutation = useMutation({
        mutationFn: (data) => {
            return createFeedBack(data);
        },
        onSuccess(data) {
            getFeedbackQuery.refetch();
        },
        onError(error) {
            console.log('🚀 ~ file: index.jsx:45 ~ error:', error);
        },
    });
    const submitFeedback = (data) => {
        createFeedbackMutation.mutate(data);
    };

    return (
        <div>
            {data?.isFeedback ? (
                <div className="mx-20">
                    <FeedbackContent feedback={data} />
                </div>
            ) : (
                <FormProvider {...methods}>
                    <form
                        className="flex flex-col gap-3 mx-20"
                        onSubmit={methods.handleSubmit(submitFeedback)}>
                        <AvatarText
                            name={userId?.name}
                            src={userId?.avatar?.url}
                        />
                        <div className="grid grid-cols-2  gap-3 justify-start">
                            <div className="col-span-1 flex flex-col gap-2">
                                <StarsForm />
                                <ImagesForm />
                            </div>
                            <div className="col-span-1">
                                <Content control={methods.control} />
                            </div>
                        </div>
                        {!data?.isFeedback && (
                            <div>
                                <Button
                                    type="submit"
                                    pill
                                    isProcessing={
                                        createFeedbackMutation.isLoading
                                    }
                                    className="bg-primary/80 !border-none focus:!ring-0 hover:!bg-primary w-40 float-right">
                                    Submit
                                </Button>
                            </div>
                        )}
                    </form>
                </FormProvider>
            )}
        </div>
    );
};

export default memo(FeedbackForm);
