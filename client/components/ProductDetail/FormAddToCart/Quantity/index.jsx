import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const Quantity = () => {
    const { register, setValue } = useFormContext();
    const quantity = useWatch({ name: 'quantity' });
    return (
        <div className="flex text-center gap-1">
            <button
                className="text-xl w-10 h-10  border-2"
                onClick={() => {
                    if (quantity > 0) setValue('quantity', quantity - 1);
                }}>
                -
            </button>
            <input
                type="text"
                className="w-10 h-10 outline-none border-2"
                {...register('quantity')}
            />
            <button
                className="text-xl w-10 h-10  border-2"
                onClick={() => {
                    setValue('quantity', quantity + 1);
                }}>
                +
            </button>
        </div>
    );
};

export default Quantity;
