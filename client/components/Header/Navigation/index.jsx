'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import routes from '@/routes';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
const Navigate = () => {
    const userId = useSelector(getUserId);
    const navs = [
        { name: 'Home', href: routes.home },
        { name: 'New ', href: routes.newItems },
        { name: 'Shirt', href: routes.shirt },
        { name: 'Pants', href: routes.pants },
    ];

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
                                'text-base font-medium px-4 py-2 rounded-t-xl hover:bg-default ',
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
