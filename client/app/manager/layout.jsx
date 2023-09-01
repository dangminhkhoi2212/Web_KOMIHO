'use client';
import Link from 'next/link';
import { createElement } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { LuClipboardList } from 'react-icons/lu';
import { IoStorefrontOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { getName, getUrlAvatar, getUserId } from '@/redux/selector';
import routes from '@/routes';
import AvatarText from '@/components/Avatar';
import { AiOutlineDelete } from 'react-icons/ai';

const childrenAccount = [
    { name: 'Profile', link: routes.profile },
    { name: 'Address', link: routes.address },
    { name: 'Password', link: routes.password },
];
const childrenStore = [{ name: 'Add Product', link: routes.addProduct }];
const listParent = [
    {
        icon: AiOutlineUser,
        name: 'My Account',
        link: routes.myAccount,
        children: childrenAccount,
    },
    {
        icon: IoStorefrontOutline,
        name: 'My Store',
        link: routes.myStore,
        children: childrenStore,
    },
    {
        icon: LuClipboardList,
        name: 'My Purchase',
        link: routes.myPurchase,
        children: null,
    },
    {
        icon: AiOutlineDelete,
        name: 'Delete Account',
        link: routes.deleteAccount,
        children: null,
    },
];
const layout = ({ children }) => {
    const UrlAvatar = useSelector(getUrlAvatar);
    const userId = useSelector(getUserId);
    const name = useSelector(getName);

    return (
        <div className="grid grid-cols-12 gap-3 items-start xl:mx-20 my-5">
            <div className="col-span-3 flex flex-col gap-3 justify-center items-center">
                <div className="border-4 border-double py-3 w-full rounded-xl">
                    <AvatarText
                        name={name}
                        src={UrlAvatar}
                        text={'Edit profile'}
                    />
                </div>
                <div className="flex flex-col  gap-2">
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
            <div className="col-span-9 xl:p-5  rounded-md bg-white relative min-h-[250px]">
                {children}
            </div>
        </div>
    );
};

export default layout;
