import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const Quantity = () => {
    const { register, setValue } = useFormContext();
    const quantity = useWatch({ name: 'quantity' });
    console.log('🚀 ~ file: index.jsx:7 ~ Quantity ~ quantity:', quantity);
    return (
        <div className="flex text-center gap-1">
            <div
                role="button"
                className="text-xl w-10 h-10  border-2"
                onClick={() => {
                    if (quantity > 0) setValue('quantity', quantity - 1);
                }}>
                -
            </div>
            <input
                type="text"
                className="w-10 h-10 outline-none border-none ring-2 text-center"
                {...register('quantity')}
            />
            <div
                role="button"
                className="text-xl w-10 h-10  border-2"
                onClick={() => {
                    setValue('quantity', quantity + 1);
                }}>
                +
            </div>
        </div>
    );
};

export default Quantity;
