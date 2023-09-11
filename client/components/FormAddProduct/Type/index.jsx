'use client';

import { Label, Select } from 'flowbite-react';
import { useFormContext, Controller } from 'react-hook-form';
import { listShirt, listPants } from './list';
const Type = () => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-base  font-medium">
                Type
            </label>

            <div className="flex items-center ms-5">
                <input
                    id="shirt"
                    type="radio"
                    value="shirt"
                    name="type"
                    {...register('type')}
                    className="w-4 h-4 text-accent bg-gray-100 border-accent focus:ring-accent"
                />
                <label
                    htmlFor="shirt"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Shirt
                </label>
            </div>
            <div className="flex items-center ms-5">
                <input
                    id="pants"
                    type="radio"
                    value="pants"
                    name="type"
                    {...register('type')}
                    className="w-4 h-4 text-accent bg-gray-100 border-accent focus:ring-accent"
                />
                <label
                    htmlFor="pants"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Pants
                </label>
            </div>
            <span className="text-sm text-red-400">
                {errors?.type?.message}
            </span>
        </div>
    );
};

export default Type;
