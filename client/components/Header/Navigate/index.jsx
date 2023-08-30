'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import routes from '@/routes';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '@/redux/selector';
const Navigate = () => {
    const user = useSelector(getUser);
    const [navs, setNavs] = useState([
        { name: 'Home', href: routes.home },
        { name: 'Shirt', href: routes.shirt },
        { name: 'Pants', href: routes.pants },
        { name: 'Add Product', href: routes.addProduct },
        { name: 'My Store', href: `${routes.store}/${user?._id}` },
    ]);
    const pathname = usePathname();
    return (
        <div className="flex flex-row justify-center items-center gap-x-4 text-black ">
            {navs &&
                navs.map((nav) => {
                    const isActive = pathname === nav.href;
                    const active = isActive ? 'bg-default' : '';

                    return (
                        <Link
                            href={nav.href}
                            key={nav.name}
                            as={nav.href}
                            className={clsx(
                                'text-base font-medium px-4 py-3 rounded-t-xl hover:bg-default ',
                                active,
                            )}>
                            <span>{nav.name}</span>
                        </Link>
                    );
                })}
        </div>
    );
};

export default Navigate;
