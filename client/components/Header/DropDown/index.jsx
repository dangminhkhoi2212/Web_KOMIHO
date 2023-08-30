'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/redux/selector';
import { setUser } from '@/components/Auth/authSlice';
import routes from '@/routes';

const listDropdown = [{ name: 'My Account', link: routes.profile }];
export default function DropdownItem() {
    const user = useSelector(getUser);
    const [show, setShow] = useState(false);
    const handleLogout = () => {
        setUser(null);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        localStorage.removeItem('persist:root');
        signOut({ callbackUrl: routes.login });
    };
    return (
        <>
            {user && (
                <div
                    className="relative text-gray-600 py-1 "
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}>
                    <AvatarText
                        src={user?.avatar?.url}
                        text={user?.name}
                        className="cursor-pointer text-sm"
                    />
                    {show && (
                        <div
                            className="flex flex-col gap-1  absolute top-full bg-white shadow-md rounded-md p-2 ring-1 z-drop-down  break-words w-52
                                ">
                            {listDropdown.map((item) => (
                                <Link
                                    href={item.link}
                                    key={item.name}
                                    className="hover:bg-primary hover:text-white  px-2 py-1 rounded-md text-start">
                                    {item.name}
                                </Link>
                            ))}
                            <hr />
                            <button
                                className="hover:bg-primary hover:text-white  px-2 py-1 rounded-md text-start"
                                onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
