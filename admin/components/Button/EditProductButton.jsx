import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toggleLockProduct } from '@/services/product.service';
import { Loader2 } from 'lucide-react';

const EditProductButton = ({ productId, lock, name, handleEvent }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const defaultValues = {
        status: lock?.status || false,
        reason: lock?.reason || '',
    };
    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
    } = useForm({
        defaultValues,
    });

    const editProductMutation = useMutation({
        mutationFn: (lock) => {
            return toggleLockProduct({ productId, lock });
        },
        onSuccess(data) {
            queryClient.invalidateQueries('get-all-products');
            if (handleEvent) handleEvent();
            setOpen(false);
        },
        onError(error) {
            console.log(
                '🚀 ~ file: EditProductButton.jsx:40 ~ onSuccess ~ error:',
                error,
            );
        },
    });

    const saveChange = async (data) => {
        const lock = { status: data.status, reason: data.reason };
        editProductMutation.mutate(lock);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex justify-center items-center">
                    <Pen className="hover:bg-secondary p-2 rounded-lg w-8 h-8" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(saveChange)}>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Make changes to{' '}
                            <span className="font-medium text-gray-800">
                                {name}
                            </span>
                            . Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex gap-5">
                            Lock:{' '}
                            {
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(e) =>
                                                field.onChange(e)
                                            }
                                        />
                                    )}
                                />
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="reason">Reason</label>
                            <textarea
                                rows={4}
                                {...register('reason')}
                                id="reason"
                                className="ring-1 focus:ring-2 focus:ring-accent outline-none border-none p-4 rounded-lg"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={editProductMutation.isPending}
                            className={cn(
                                {
                                    'cursor-not-allowed':
                                        editProductMutation.isPending,
                                },
                                'flex gap-2',
                            )}>
                            {editProductMutation.isPending && (
                                <Loader2 className="animate-spin" />
                            )}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductButton;
