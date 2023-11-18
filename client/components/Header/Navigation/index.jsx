'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import routes from '@/routes';
import { cn } from '@/lib/utils';
const Navigate = () => {
    const navs = [
        { name: 'Latest New', href: `${routes.products}?sortBy=top-new` },
        { name: 'Sale 50% Off', href: `${routes.products}?percent=50` },
        { name: 'Top Sold ', href: `${routes.products}?sortBy=top-sold` },
        { name: 'About Us', href: routes.aboutUs },
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
                            className={cn(
                                'text-sm font-medium px-4 py-2 rounded-t-xl hover:bg-default ',
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
