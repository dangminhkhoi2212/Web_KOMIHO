'use client';
import { useFormContext, useWatch } from 'react-hook-form';
import { RiSubtractLine } from 'react-icons/ri';
import { CgMathPlus } from 'react-icons/cg';
const Quantity = () => {
    const { register, setValue, getValues } = useFormContext();
    const quantity = useWatch({ name: 'quantity' });
    return (
        <div className="flex text-center gap-1">
            <div
                role="button"
                className="text-xl w-10 h-10  border-2 flex items-center justify-center"
                onClick={() => {
                    if (quantity !== 0) setValue('quantity', quantity - 1);
                }}>
                <RiSubtractLine />
            </div>
            <input
                type="text"
                className="w-12 h-10 outline-none border-none ring-2 text-center"
                {...register('quantity')}
            />
            <div
                role="button"
                className="text-xl w-10 h-10  border-2 flex items-center justify-center"
                onClick={() => {
                    if (quantity < 100) setValue('quantity', quantity + 1);
                }}>
                <CgMathPlus />
            </div>
        </div>
    );
};

export default Quantity;
