'use client';
import React from 'react';
import Logo from '../Logo';
import { routes } from '@/routes';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { createElement } from 'react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users2 } from 'lucide-react';
import { LayoutList } from 'lucide-react';
import { AlertOctagon } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();
    const listNavs = [
        {
            name: 'Dashboard',
            link: routes.dashboard,
            icon: Home,
            isActive: pathname === '/',
        },
        {
            name: 'User',
            link: routes.users,
            icon: Users2,
            isActive: pathname.startsWith(routes.users),
        },
        {
            name: 'Products',
            link: routes.products,
            icon: LayoutList,
            isActive: pathname.startsWith(routes.products),
        },
        {
            name: 'Reports',
            link: routes.report,
            icon: AlertOctagon,
            isActive: pathname.startsWith(routes.report),
        },
    ];
    return (
        <div className="bg-default text-black flex flex-col gap-5 w-full sticky top-0 bottom-0 py-5 overflow-hidden container min-h-screen">
            <div>
                <Logo />
            </div>
            {/* <div className="h-[1px] w-full bg-slate-300 rounded-full"></div> */}
            <div className="flex justify-center items-center bg-white rounded-lg py-2 min-h-[40px]">
                <UserButton
                    showName
                    className="text-white"
                    afterSignOutUrl={routes.signIn}
                />
            </div>
            {/* <div className="h-[1px] w-full bg-slate-300 rounded-full"></div> */}
            <ul className="flex flex-col gap-1">
                {listNavs.map((nav) => {
                    return (
                        <li key={nav.name} className="relative">
                            <Link
                                className={cn(
                                    'flex gap-2 items-center hover:bg-primary/30 px-3 py-2  rounded-lg',
                                    { 'bg-primary/30': nav.isActive },
                                )}
                                href={nav.link}>
                                {createElement(nav.icon)}
                                <span>{nav.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Navbar;
