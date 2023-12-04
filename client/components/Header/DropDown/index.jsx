'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { createElement, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { useSelector } from 'react-redux';
import { getName, getUrlAvatar } from '@/redux/selector';
import routes from '@/routes';
import Cookies from 'js-cookie';
import { resetAllReducers } from '@/redux/store';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { User2 } from 'lucide-react';
import { Store } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const listDropdown = [
    { name: 'Account', link: routes.profile, icon: User2 },
    { name: 'Store', link: routes.myStore, icon: Store },
];
export default function DropdownItem() {
    const UrlAvatar = useSelector(getUrlAvatar);

    const name = useSelector(getName);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleLogout = () => {
        resetAllReducers();
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        signOut({ callbackUrl: routes.login });

        localStorage.removeItem('persist:user');
    };
    const handleChoose = (item) => {
        router.push(item.link);
        setOpen(false);
    };

    return (
        <>
            <Popover open={open} onOpenChange={() => setOpen(!open)}>
                <PopoverTrigger>
                    <AvatarText
                        src={UrlAvatar}
                        text={name}
                        className="cursor-pointer text-sm"
                    />
                </PopoverTrigger>
                <PopoverContent className="ring-1 z-drop-down w-52">
                    <div className="flex flex-col gap-1   bg-white  rounded-md   break-words">
                        {listDropdown.map((item) => (
                            <div
                                role="button"
                                onClick={() => handleChoose(item)}
                                key={item.name}
                                className="flex gap-2 items-center hover:bg-primary hover:text-white  px-2 py-1 rounded-md text-start">
                                {createElement(item.icon, { size: '18' })}
                                {item.name}
                            </div>
                        ))}
                        <hr />
                        <button
                            className="flex gap-2 items-center hover:bg-primary hover:text-white  px-2 py-1 rounded-md text-start"
                            onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}
