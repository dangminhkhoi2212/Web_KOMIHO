import { MdOutlineEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';

import Navigate from './Navigate';
import Logo from '@/components/Logo';
import MediaLink from './MediaLink';
import Search from './Search';
import UserTools from './UserTools';
import DropDown from '@/components/Header/DropDown';
import { getUser } from '@/redux/selector';

const Header = () => {
    const user = useSelector(getUser);

    return (
        <div className="w-full  bg-white text-center pt-3 z-header text-sm">
            <div className="flex items-center justify-around">
                <div className="">
                    <MdOutlineEmail className="inline text-2xl mx-2" />
                    <span>kkhoi600@gmail.com</span>
                </div>
                <Logo />
                <MediaLink />
            </div>
            <div className="flex flex-row justify-evenly items-center sticky top-10">
                <Search />
                <Navigate />
                {user._id ? <DropDown /> : <UserTools />}
            </div>
        </div>
    );
};

export default Header;
