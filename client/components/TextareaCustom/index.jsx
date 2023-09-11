'use client';

import { Flowbite, Label, Textarea } from 'flowbite-react';
const customTheme = {
    textarea: {
        base: 'block w-full rounded-lg border disabled:cursor-not-allowed disabled:opacity-50',
        colors: {
            gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent focus:ring-accent',
            failure:
                'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500',
            warning:
                'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500',
            success:
                'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500',
        },
        withShadow: {
            on: 'shadow-sm dark:shadow-sm-light',
            off: '',
        },
    },
};
const TextareaCustom = ({
    id = '',
    label = '',
    type = 'text',
    min = '',
    max = '',
    onFocus = () => {},
    onChange = () => {},
    onBlur = () => {},
    placeholder = '',
    helperText,
    color = 'gray',
    value,
}) => {
    const handleOnchangeKeyDown = (e) => {
        if (e.key === 'Enter') e.preventDefault();
    };
    return (
        <div className="flex flex-col  gap-y-1 max-w-md">
            <Flowbite theme={{ theme: customTheme }}>
                <Label htmlFor={id} value={label} />
                <div className="flex flex-col">
                    <Textarea
                        helperText={helperText}
                        id={id}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        type={type}
                        color={color}
                        value={value}
                        onFocus={onFocus}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={handleOnchangeKeyDown}
                    />
                </div>
            </Flowbite>
        </div>
    );
};

export default TextareaCustom;
