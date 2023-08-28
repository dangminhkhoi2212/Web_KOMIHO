'use client';

import { Flowbite, Label, TextInput } from 'flowbite-react';
const customTheme = {
    textInput: {
        field: {
            input: {
                sizes: {
                    sm: 'p-2 sm:text-xs',
                    md: 'p-2.5 text-sm',
                    lg: 'sm:text-md p-4',
                },
                colors: {
                    gray: 'bg-gray-50 border-primary text-gray-900 focus:border-accent focus:ring-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500',
                    failure:
                        'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500',
                    warning:
                        'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500',
                    success:
                        'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500',
                },
            },
        },
    },
};
const InputCustom = ({
    id,
    label,
    type,
    value,
    helperText,
    color,
    placeholder,
    onChange,
    ...props
}) => {
    const handleOnchangeKeyDown = (e) => {
        if (e.key === 'Enter') e.preventDefault();
    };
    return (
        <div className="flex flex-col  gap-y-1 max-w-md z-container">
            <Flowbite theme={{ theme: customTheme }}>
                <Label htmlFor={id} value={label} />
                <div className="flex flex-col">
                    <TextInput
                        id={id}
                        type={type}
                        helperText={helperText}
                        color={color}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        {...props}
                        onKeyDown={handleOnchangeKeyDown}
                    />
                </div>
            </Flowbite>
        </div>
    );
};

export default InputCustom;
