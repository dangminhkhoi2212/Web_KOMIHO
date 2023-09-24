import TextareaCustom from '@/components/TextareaCustom';
import React, { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Badge } from 'flowbite-react';
const Tag = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="text-base font-medium">
                Tags
            </label>

            <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                    <TextareaCustom
                        id="tags"
                        placeholder="Ex: T-shirt, polo, jeans, ..."
                        helperText={errors.feedback?.message}
                        color={errors.feedback?.message ? 'failure' : 'gray'}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                        rows={4}
                        className="w-full"
                    />
                )}
            />
            <Badge color="info">
                Leave a tag something to improve search results.
            </Badge>
        </div>
    );
};

export default memo(Tag);
