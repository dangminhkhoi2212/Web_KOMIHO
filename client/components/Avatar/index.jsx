'use client';
import clsx from 'clsx';
import Image from 'next/image';

const AvatarText = ({ src, name, text, size = 'md', ...rest }) => {
    const sizes = {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 80,
        xl: 144,
    };
    if (!src) return <></>;
    return (
        <div className="flex gap-2 items-center">
            <div
                className={clsx(
                    { 'w-6 h-6': size === 'xs' },
                    { 'w-8 h-8': size === 'sm' },
                    { 'w-10 h-10': size === 'md' },
                    { 'w-20 h-20': size === 'lg' },
                    { 'w-36 h-36': size === 'xl' },

                    ' rounded-full relative overflow-hidden',
                )}>
                <Image
                    fill={true}
                    src={src}
                    alt={src}
                    sizes={sizes[size] * 2.5 + 'px'} // get a larger size to avoid blurring image
                    className="object-cover object-center"
                />
            </div>
            <div className="space-y-1 text-sm text-gray-500 font-medium">
                {name && (
                    <div className="text-gray-500 text-md font-bold">
                        {name}
                    </div>
                )}
                {text}
            </div>
        </div>
    );
};
export default AvatarText;
