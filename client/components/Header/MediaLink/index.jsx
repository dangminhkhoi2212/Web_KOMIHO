import Image from 'next/image';
import { BsFacebook } from 'react-icons/bs';
import { IoLogoYoutube } from 'react-icons/io';
import { BiLogoTiktok } from 'react-icons/bi';
import { PiInstagramLogoFill } from 'react-icons/pi';
import { FaFacebook } from 'react-icons/fa';
import FacebookLogo from '@/public/logo/facebook.svg';
import InstagramLogo from '@/public/logo/instagram.svg';
import YoutubeLogo from '@/public/logo/youtube.svg';
import TiktokLogo from '@/public/logo/tiktok.svg';
import clsx from 'clsx';

const lists = [
    { name: 'Facebook', img: FacebookLogo, cls: 'w-full h-full', url: '/' },
    { name: 'Instagram', img: InstagramLogo, cls: 'w-full h-full', url: '/' },
    { name: 'Youtube', img: YoutubeLogo, cls: 'w-full h-full', url: '/' },
    { name: 'Tiktok', img: TiktokLogo, cls: 'w-full h-full', url: '/' },
];
const MediaLink = () => {
    return (
        <div className="flex gap-x-5  w-40">
            {lists.map((list) => (
                <a key={list.name} href={list.url}>
                    <Image
                        src={list.img}
                        width={0}
                        height={0}
                        alt={list.name}
                        className={clsx(list.cls)}
                    />
                </a>
            ))}
        </div>
    );
};

export default MediaLink;
