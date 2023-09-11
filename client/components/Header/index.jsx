import { MdOutlineEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';

import { IoStorefrontOutline } from 'react-icons/io5';
import { TfiShoppingCartFull } from 'react-icons/tfi';
import Logo from '@/components/Logo';
import MediaLink from './MediaLink';
import Search from './Search';
import UserTools from './UserTools';
import DropDown from '@/components/Header/DropDown';
import { getUserId } from '@/redux/selector';
import Navigation from './Navigation';
import Link from 'next/link';
import routes from '@/routes';
const Header = () => {
    const userId = useSelector(getUserId);

    return (
        <div className="grid grid-cols-3 px-10 items-center justify-items-center bg-white text-center pt-1 z-header text-sm sticky top-0 ">
            <div className="col-span-1 flex flex-col justify-start gap-3">
                <div className="">
                    <MdOutlineEmail className="inline text-2xl mx-2" />
                    <a href="mailto:kkhoi600@gmail.com">kkhoi600@gmail.com</a>
                </div>
                <div className="">
                    <Search />
                </div>
            </div>
            <div className="col-span-1">
                <div className="">
                    <Logo />
                </div>
                <Navigation />
            </div>
            <div className="col-span-1 flex flex-col justify-between ">
                <div className="col-span-1 text-2xl justify-end flex gap-6">
                    <Link href={routes.store(userId)}>
                        <IoStorefrontOutline />
                    </Link>
                    <Link href={'/'}>
                        <TfiShoppingCartFull />
                    </Link>
                </div>
                <div className="">{userId ? <DropDown /> : <UserTools />}</div>
            </div>
        </div>
    );
};

export default Header;
