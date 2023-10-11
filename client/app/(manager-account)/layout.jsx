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

const listParent = [
    {
        icon: AiOutlineUser,
        name: 'Profile',
        link: routes.profile,
    },
    {
        icon: IoLocationOutline,
        name: 'Address',
        link: routes.address,
    },
    {
        icon: HiOutlineClipboardList,
        name: 'My Purchase',
        link: routes.myPurchase,
    },
    {
        icon: AiOutlineLock,
        name: 'Password',
        link: routes.password,
    },
    {
        icon: RiDeleteBin6Line,
        name: 'Delete Account',
        link: routes.deleteAccount,
    },
];
const layout = ({ children }) => {
    const UrlAvatar = useSelector(getUrlAvatar);
    const userId = useSelector(getUserId);
    const name = useSelector(getName);

    return (
        <div className="grid grid-cols-12 gap-5 items-start xl:mx-20 my-5">
            <div className="col-span-3 flex flex-col gap-5 justify-center items-center">
                <div className="border-4 border-double py-3 w-full rounded-xl bg-white">
                    <AvatarText
                        name={name}
                        src={UrlAvatar}
                        text={'Account Management'}
                    />
                </div>
                <div className="flex flex-col  gap-2 bg-secondary px-6 py-5 w-full rounded-xl">
                    {listParent.map((item) => (
                        <div key={item.name}>
                            <Link
                                href={item.link}
                                className="flex items-center gap-2 hover:text-primary text:black">
                                {createElement(item.icon, {
                                    className: 'text-xl',
                                })}
                                <span className="">{item.name}</span>
                            </Link>
                            <div className="mt-1 flex flex-col justify-between gap-2 ms-10 text-gray-700 ">
                                {item.children &&
                                    item.children.map((child) => (
                                        <Link
                                            href={child.link}
                                            key={child.name}
                                            as={child.link}
                                            className="hover:text-primary">
                                            {child.name}
                                        </Link>
                                    ))}
                            </div>
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
