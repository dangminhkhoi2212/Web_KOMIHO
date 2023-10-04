'use client';

import { useEffect, useState } from 'react';
import Size from './Size';
import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';

const Color = ({ colors }) => {
    const { setValue, getValues } = useFormContext();
    const [chooseColor, setChooseColor] = useState(null);
    const [sizes, setSizes] = useState(null);
    if (!colors) return <></>;
    const color = getValues('color');
    useEffect(() => {
        if (chooseColor) {
            setValue('color', chooseColor?.name);
            setSizes(chooseColor.sizes);
        }
    }, [chooseColor]);

    useEffect(() => {
        if (!colors) return;
        const findColor = colors.find((c) => c.name === color);
        setChooseColor(findColor);
    }, [colors]);
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3">
                Color:
                {colors.map((item, index) => (
                    <div
                        role="button"
                        key={index}
                        className={clsx(
                            'px-2 py-1 rounded-md ring-1 ',
                            chooseColor?.name === item.name
                                ? 'bg-primary text-white'
                                : '',
                        )}
                        onClick={() => setChooseColor(item)}>
                        {item.name}
                    </div>
                ))}
            </div>
            <Size sizes={sizes} />
        </div>
    );
};

export default Color;
