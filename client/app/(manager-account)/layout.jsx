'use client';
import Link from 'next/link';
import { Suspense, createElement } from 'react';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { LuClipboardList } from 'react-icons/lu';
import { IoStorefrontOutline, IoLocationOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { useSelector } from 'react-redux';
import { getName, getUrlAvatar, getUserId } from '@/redux/selector';
import routes from '@/routes';
import AvatarText from '@/components/Avatar';
import { AiOutlineDelete } from 'react-icons/ai';
import Loading from '../loading';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { PiUsersThreeBold } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const layout = ({ children }) => {
    const UrlAvatar = useSelector(getUrlAvatar);
    const name = useSelector(getName);
    const pathName = usePathname();
    const listParent = [
        {
            icon: AiOutlineUser,
            name: 'Profile',
            link: routes.profile,
            active: pathName.endsWith(routes.profile),
        },
        {
            icon: IoLocationOutline,
            name: 'Address',
            link: routes.address,
            active: pathName.includes(routes.address),
        },
        {
            icon: HiOutlineClipboardList,
            name: 'My Purchase',
            link: routes.myPurchase,
            active: pathName.includes(routes.myPurchase),
        },
        {
            icon: PiUsersThreeBold,
            name: 'Favorite',
            link: routes.favorite,
            active: pathName.includes(routes.favorite),
        },
        {
            icon: AiOutlineLock,
            name: 'Password',
            link: routes.password,
            active: pathName.includes(routes.password),
        },
        {
            icon: RiDeleteBin6Line,
            name: 'Delete Account',
            link: routes.deleteAccount,
            active: pathName.includes(routes.deleteAccount),
        },
    ];
    return (
        <div className="grid grid-cols-12 gap-5 items-start xl:mx-20 my-5">
            <div className="col-span-3 flex flex-col gap-5 justify-center items-center">
                <div className="border-4 border-double py-3 w-full rounded-xl bg-white flex justify-center">
                    <AvatarText
                        name={name}
                        src={UrlAvatar}
                        text={'Account Management'}
                    />
                </div>
                <div className="flex flex-col  gap-1  px-6 py-5 w-full rounded-xl">
                    {listParent.map((item) => (
                        <div key={item.name}>
                            <Link
                                href={item.link}
                                className={cn(
                                    'flex items-center gap-2 py-2 px-5 mx-2 rounded-md text:black hover:bg-primary/20',
                                    { 'bg-primary/30': item.active },
                                )}>
                                {createElement(item.icon, {
                                    className: 'text-xl',
                                })}
                                <span className="">{item.name}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-9  relative min-h-[250px]">
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
        </div>
    );
};

export default layout;
