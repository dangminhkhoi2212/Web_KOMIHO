'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { cn } from '@/lib/utils';
const Navigate = () => {
    const pathName = usePathname();
    const navs = [
        {
            name: 'Home',
            href: `${routes.home}`,
            active: pathName.endsWith(routes.home),
        },
        {
            name: 'Latest New',
            href: `${routes.products}?sortBy=top-new`,
            active: pathName.includes(`${routes.products}?sortBy=top-new`),
        },
        {
            name: 'Sale 50% Off',
            href: `${routes.products}?percent=50`,
            active: pathName.includes(`${routes.products}?percent=50`),
        },
        {
            name: 'Top Sold ',
            href: `${routes.products}?sortBy=top-sold`,
            active: pathName.includes(`${routes.products}?sortBy=top-sold`),
        },
        {
            name: 'About Us',
            href: routes.aboutUs,
            active: pathName.includes(routes.aboutUs),
        },
    ];

    const pathname = usePathname();
    return (
        <div className="flex flex-row justify-center items-center gap-x-4 text-black ">
            {navs &&
                navs.map((nav) => {
                    return (
                        <Link
                            href={nav.href}
                            key={nav.name}
                            className={cn(
                                'text-sm font-medium px-4 py-2 rounded-t-xl hover:bg-default ',
                                { 'bg-primary': nav.active },
                            )}>
                            <span>{nav.name}</span>
                        </Link>
                    );
                })}
        </div>
    );
};

export default Navigate;
