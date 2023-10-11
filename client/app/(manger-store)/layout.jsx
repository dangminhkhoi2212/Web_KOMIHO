'use client';
import Link from 'next/link';
import { Suspense, createElement } from 'react';
import { LuClipboardList, LuLayoutDashboard } from 'react-icons/lu';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { getName, getUrlAvatar, getUserId } from '@/redux/selector';

import routes from '@/routes';
import AvatarText from '@/components/Avatar';
import Loading from '../loading';

const listParent = [
    {
        icon: LuLayoutDashboard,
        name: 'All Products',
        link: routes.managerAllProducts,
    },
    {
        icon: HiOutlineViewGridAdd,
        name: 'Add Product',
        link: routes.managerAddProduct,
    },
    {
        icon: LuClipboardList,
        name: 'Order Management',
        link: routes.managerOrder,
    },
];
const layout = ({ children }) => {
    const UrlAvatar = useSelector(getUrlAvatar);
    const userId = useSelector(getUserId);
    const name = useSelector(getName);

    return (
        <div className="grid grid-cols-12 gap-5 items-start  my-5">
            <div className="col-span-3 flex flex-col gap-5 justify-center items-center">
                <div className="border-4 border-double py-3 w-full rounded-xl bg-white">
                    <AvatarText
                        name={name}
                        src={UrlAvatar}
                        text={'Store Management'}
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
            <div className="col-span-9 xl:p-5  rounded-xl  relative min-h-[250px]">
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
        </div>
    );
};

export default layout;
