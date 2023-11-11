import TextareaCustom from '@/components/TextareaCustom';
import { createReport } from '@/services/report.service';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const FormReport = ({ userId, productId }) => {
    const { handleSubmit, control } = useForm({});
    const reportMutation = useMutation({
        mutationFn: (content) => {
            return createReport({ userId, productId, content });
        },
        onSuccess(data) {
            toast.success('Report successfully.');
        },
        onError(error) {
            toast.error('Have an occurred error. Please try again.');
        },
    });
    const submit = (data) => {
        reportMutation.mutate(data.content);
    };
    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-2">
            <Controller
                control={control}
                name="content"
                render={({ field }) => (
                    <TextareaCustom
                        rows={4}
                        id="content"
                        label="Content"
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Report content ..."
                    />
                )}
            />
            <Button
                type="submit"
                className="bg-primary hover:!bg-primary/50"
                processing={reportMutation.isLoading}
                disabled={reportMutation.isLoading}>
                Submit
            </Button>
        </form>
    );
};

export default FormReport;
