'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { getName, getUrlAvatar, getUserId } from '@/redux/selector';
import { resetUser } from '@/components/Auth/authSlice';
import routes from '@/routes';
import Cookies from 'js-cookie';

const listDropdown = [
    { name: 'Manager Account', link: routes.profile },
    { name: 'Manager Store', link: routes.managerAllProducts },
];
export default function DropdownItem() {
    const UrlAvatar = useSelector(getUrlAvatar);
    const userId = useSelector(getUserId);
    const name = useSelector(getName);

    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleLogout = async () => {
        dispatch(resetUser());
        await signOut({ callbackUrl: routes.login });
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        localStorage.removeItem('persist:user');
    };
    return (
        <>
            <div
                className="relative text-gray-600 py-1 "
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}>
                <AvatarText
                    src={UrlAvatar}
                    text={name}
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
        </>
    );
}
