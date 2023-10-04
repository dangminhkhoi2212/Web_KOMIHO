'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

const Size = ({ sizes }) => {
    const [chooseSize, setChooseSize] = useState(null);

    const { setValue, getValues } = useFormContext();
    const size = getValues('size');
    useEffect(() => {
        if (chooseSize) {
            setValue('size', chooseSize?.type);
        }
    }, [chooseSize]);
    useEffect(() => {
        if (!sizes) return;
        setChooseSize(sizes.find((s) => s.type === size));
    }, [sizes]);

    if (!sizes) return <></>;
    return (
        <div className="flex gap-3">
            <h1>Size:</h1>
            <div className="flex gap-3 items-center">
                {sizes.map((size, index) => (
                    <div
                        key={index}
                        role="button"
                        className={clsx(
                            'px-2 py-1 ring-1 rounded-md',
                            size.quantity === 0
                                ? 'text-gray-300 ring-1 ring-secondary'
                                : '',
                            chooseSize?.type === size.type
                                ? 'bg-primary text-white '
                                : '',
                        )}
                        disabled={!size.quantity}
                        onClick={() => {
                            if (size.quantity) setChooseSize(size);
                        }}>
                        {size.type} / {size.quantity}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Size;
