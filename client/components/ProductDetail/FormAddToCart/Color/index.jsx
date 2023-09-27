'use client';

import { useEffect, useState } from 'react';
import Size from './Size';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

const Color = ({ colors }) => {
    const [chooseColor, setChooseColor] = useState(null);
    const [sizes, setSizes] = useState(null);
    const { setValue } = useFormContext();
    useEffect(() => {
        if (chooseColor) {
            setValue('color', chooseColor?.name);
            setSizes(chooseColor.sizes);
        }
    }, [chooseColor]);

    useEffect(() => {
        if (!colors) return;
        setChooseColor(colors[0]);
    }, [colors]);
    if (!colors) return <></>;
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3">
                Color:
                {colors.map((item, index) => (
                    <button
                        key={index}
                        className={clsx(
                            'px-2 py-1 rounded-md ring-1 ',
                            chooseColor?.name === item.name
                                ? 'bg-primary text-white'
                                : '',
                        )}
                        onClick={() => setChooseColor(item)}>
                        {item.name}
                    </button>
                ))}
            </div>
            <Size sizes={sizes} />
        </div>
    );
};

export default Color;
