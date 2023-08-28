'use client';
import { createElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RxDashboard } from 'react-icons/rx';
import { BsCardList } from 'react-icons/bs';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import clsx from 'clsx';
const index = () => {
    const pathname = usePathname();
    const links = [
        { name: 'Home', path: '/', icon: RxDashboard },
        { name: 'Products', path: '/products', icon: BsCardList },
        {
            name: 'Add Product',
            path: '/addProducts',
            icon: AiOutlineAppstoreAdd,
        },
    ];
    return (
        <div className="flex flex-col  bg-white h-full">
            <div className="h-height-header bg-primary flex justify-center items-center font-extrabold text-2xl rounded-ee-3xl">
                <Link href={'/'}>KOMIHO</Link>
            </div>
            <ul className="mt-10 flex flex-col gap-2">
                {links.map((link) => {
                    const isActive = pathname === link.path;

                    return (
                        <li
                            key={link.name}
                            className={clsx(
                                { 'bg-backgroundColor ': isActive },
                                ' rounded-s-full ms-3  hover:text-accent relative',
                            )}>
                            <Link
                                href={link.path}
                                className="flex justify-start items-center gap-4    py-2 px-2 ">
                                <span className="bg-accent w-10 h-10 text-white rounded-full flex items-center justify-center">
                                    {createElement(link.icon, {
                                        className: 'text-xl m-auto',
                                    })}
                                </span>
                                {link.name}
                            </Link>
                            {isActive && (
                                <>
                                    <span
                                        className="absolute right-0 top-0 -translate-y-full bg-transparent w-5 h-5 rounded-ee-3xl "
                                        style={{
                                            boxShadow: '5px 5px 0 5px #f2f2f2',
                                        }}></span>
                                    <span
                                        className="absolute right-0 bottom-0 translate-y-full bg-transparent w-10 h-10 rounded-tr-3xl  "
                                        style={{
                                            boxShadow: '5px -5px 0 5px #f2f2f2',
                                        }}></span>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default index;
