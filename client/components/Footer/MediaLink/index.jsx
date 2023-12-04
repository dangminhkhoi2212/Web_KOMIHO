import Image from 'next/image';

import FacebookLogo from '@/public/logo/facebook.svg';
import InstagramLogo from '@/public/logo/instagram.svg';
import YoutubeLogo from '@/public/logo/youtube.svg';
import TiktokLogo from '@/public/logo/tiktok.svg';
import clsx from 'clsx';

const lists = [
    {
        name: 'Facebook',
        img: FacebookLogo,
        cls: 'w-full h-full',
        url: 'https://www.facebook.com/',
    },
    {
        name: 'Instagram',
        img: InstagramLogo,
        cls: 'w-full h-full',
        url: 'https://www.instagram.com/',
    },
    {
        name: 'Youtube',
        img: YoutubeLogo,
        cls: 'w-full h-full',
        url: 'https://www.youtube.com/',
    },
    {
        name: 'Tiktok',
        img: TiktokLogo,
        cls: 'w-full h-full',
        url: 'https://www.tiktok.com/',
    },
];
const MediaLink = () => {
    return (
        <div className="flex gap-x-5  w-40">
            {lists.map((list) => (
                <a key={list.name} href={list.url} target="_blank">
                    <Image
                        src={list.img}
                        width={0}
                        height={0}
                        alt={list.name}
                        priority
                        className={clsx(list.cls)}
                    />
                </a>
            ))}
        </div>
    );
};

export default MediaLink;
