'use client';
import { Flowbite } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
const customTheme = {
    avatar: {
        root: {
            img: {
                base: 'rounded object-center object-cover',
                off: 'relative overflow-hidden bg-gray-100 dark:bg-gray-600',
                on: '',
                placeholder: 'absolute w-auto h-auto text-gray-400 -bottom-1',
            },
        },
    },
};
export default function AvatarText({ src, name, text, size = 'md', ...rest }) {
    return (
        <Flowbite theme={{ theme: customTheme }}>
            <Avatar img={src} rounded {...rest} size={size}>
                <div className="space-y-1 text-sm text-gray-500 font-medium">
                    {name && (
                        <div className="text-gray-500 text-md font-bold">
                            {name}
                        </div>
                    )}
                    {text && <div className=" ">{text}</div>}
                </div>
            </Avatar>
        </Flowbite>
    );
}
