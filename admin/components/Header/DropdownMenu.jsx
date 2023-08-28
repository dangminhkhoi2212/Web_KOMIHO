'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Avatar from '@/components/Avatar';
import { useDispatch } from 'react-redux';
import { setAdmin } from '@/redux/adminSlice';
import { getAdminStore } from '@/redux/selector';
const DropdownMenu = () => {
    const router = useRouter();
    const dispacth = useDispatch();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const admin = useSelector(getAdminStore);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    const handleLogout = () => {
        localStorage.clear();
        dispacth(setAdmin({}));
        router.push('/login');
    };
    return (
        <div className="flex  justify-center items-center">
            <div onClick={toggleDropdown}>
                <Avatar
                    src={
                        'https://res.cloudinary.com/dakwyskfm/image/upload/v1687403774/media_default/avatar_temp_r0uw3u.png'
                    }></Avatar>
            </div>

            {isDropdownOpen && (
                <div className="w-52 flex flex-col gap-2 rounded-2xl shadow-2xl  bg-white  absolute top-height-header mt-4 right-4 p-4">
                    <p className="py-1 px-2 rounded-md cursor-pointer hover:bg-default">
                        {admin.name}
                    </p>
                    <p className="py-1 px-2 rounded-md cursor-pointer hover:bg-default">
                        {admin.email}
                    </p>
                    <hr />
                    <p
                        className="py-1 px-2 rounded-md cursor-pointer hover:bg-default"
                        onClick={handleLogout}>
                        Logout
                    </p>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
