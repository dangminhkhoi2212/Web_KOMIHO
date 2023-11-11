'use client';
import Link from 'next/link';
import { Suspense, createElement } from 'react';
import { LuClipboardList, LuLayoutDashboard } from 'react-icons/lu';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { TbReportMoney } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { getName, getUrlAvatar, getUserId } from '@/redux/selector';

import routes from '@/routes';
import AvatarText from '@/components/Avatar';
import Loading from '../loading';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const layout = ({ children }) => {
    const UrlAvatar = useSelector(getUrlAvatar);
    const userId = useSelector(getUserId);
    const name = useSelector(getName);
    const pathName = usePathname();
    console.log('🚀 ~ file: layout.jsx:21 ~ layout ~ pathName:', pathName);
    const listParent = [
        {
            icon: TbReportMoney,
            name: 'Analysis',
            link: routes.myStore,
            active: pathName.endsWith(routes.myStore),
        },
        {
            icon: LuLayoutDashboard,
            name: 'All Products',
            link: routes.managerAllProducts,
            active: pathName.includes(routes.managerAllProducts),
        },
        {
            icon: HiOutlineViewGridAdd,
            name: 'Add Product',
            link: routes.managerAddProduct,
            active: pathName.includes(routes.managerAddProduct),
        },
        {
            icon: LuClipboardList,
            name: 'Order Management',
            link: routes.managerOrder,
            active: pathName.includes(routes.managerOrder),
        },
    ];
    console.log('🚀 ~ file: layout.jsx:48 ~ layout ~ listParent:', listParent);
    return (
        <div className="grid grid-cols-12 gap-5 items-start  my-5">
            <div className="col-span-3 flex flex-col gap-5 justify-center items-center">
                <div className="border-4 border-double py-3 w-full rounded-xl bg-white flex justify-center">
                    <AvatarText
                        name={name}
                        src={UrlAvatar}
                        text={'Store Management'}
                    />
                </div>
                <div className="flex flex-col  bg-secondary  py-5 w-full rounded-xl">
                    {listParent.map((item) => (
                        <div key={item.name}>
                            <Link
                                href={item.link}
                                className={clsx(
                                    'flex items-center gap-2 py-2 px-5 mx-2 rounded-md text:black',
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
            <div className="col-span-9 xl:px-5  rounded-xl  relative min-h-[250px]">
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
        </div>
    );
};

export default layout;
