'use client';
import { DiGhostSmall } from 'react-icons/di';
import { LiaTshirtSolid } from 'react-icons/lia';
import { PiPantsDuotone } from 'react-icons/pi';
import Link from 'next/link';
import { createElement } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Navigation = ({ userId }) => {
    const navs = [
        { name: 'All', link: `/store/${userId}/`, icon: DiGhostSmall },
        // {
        //     name: 'Shirt',
        //     link: `/store/${userId}/shirts`,
        //     icon: LiaTshirtSolid,
        // },
        // { name: 'Pants', link: `/store/${userId}/pants`, icon: PiPantsDuotone },
    ];
    return (
        <div className=" text-md flex flex-col gap-1">
            {navs.map((nav) => (
                <Link
                    key={nav.name}
                    className="flex gap-3 items-center hover:bg-secondary px-3 py-2 rounded-md"
                    href={nav.link}>
                    {createElement(nav.icon)}
                    {nav.name}
                </Link>
            ))}
        </div>
    );
};

export default Navigation;
