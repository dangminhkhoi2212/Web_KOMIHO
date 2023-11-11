'use client';
import { cn } from '@/lib/utils';
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
        <div className="grid grid-cols-12 items-center gap-2">
            <div
                className={cn(
                    { 'w-6 h-6': size === 'xs' },
                    { 'w-8 h-8': size === 'sm' },
                    { 'w-10 h-10': size === 'md' },
                    { 'w-20 h-20': size === 'lg' },
                    { 'w-36 h-36': size === 'xl' },

                    'col-span-3 rounded-full relative overflow-hidden',
                )}>
                <Image
                    fill={true}
                    src={src}
                    alt={src}
                    sizes={sizes[size] * 2.5 + 'px'} // get a larger size to avoid blurring image
                    className="object-cover object-center"
                />
            </div>
            <div className="col-span-9 space-y-1 text-sm text-gray-500 font-medium">
                {name && (
                    <div className=" text-gray-500 text-md font-bold line-clamp-2">
                        {name}
                    </div>
                )}
                {text}
            </div>
        </div>
    );
};
export default AvatarText;
