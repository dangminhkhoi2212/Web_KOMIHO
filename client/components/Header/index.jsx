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
import Cart from './Cart';
import { useRouter } from 'next/navigation';
import { route } from 'nextjs-routes';
const Header = () => {
    const userId = useSelector(getUserId);
    const router = useRouter();
    const handleSearch = (data) => {
        if (data.textSearch !== '') {
            const newRoute = route({
                pathname: routes.products,
                query: { textSearch: data.textSearch },
            });
            router.replace(newRoute, { scroll: true });
        } else router.replace(routes.products, { scroll: true });
    };
    return (
        <div className="grid grid-cols-3 px-10 items-center justify-items-center bg-white text-center pt-1 z-header text-sm sticky top-0 ">
            <div className="col-span-1 flex flex-col justify-start gap-3">
                <div className="">
                    <MdOutlineEmail className="inline text-2xl mx-2" />
                    <a href="mailto:kkhoi600@gmail.com">kkhoi600@gmail.com</a>
                </div>
                <div className="">
                    <Search handleEvent={handleSearch} />
                </div>
            </div>
            <div className="col-span-1">
                <div className="">
                    <Logo />
                </div>
                <Navigation />
            </div>
            <div className="col-span-1 flex flex-col justify-between ">
                <div className="col-span-1 text-2xl justify-end flex  mt-2">
                    <Link
                        href={routes.storeAllProducts(userId)}
                        className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white hover:ring-2 outline-none hover:ring-blue-300 rounded-md">
                        <IoStorefrontOutline className="font-medium text-xl text-black" />
                    </Link>
                    <div className="">
                        <Cart />
                    </div>
                </div>
                <div className="">{userId ? <DropDown /> : <UserTools />}</div>
            </div>
        </div>
    );
};

export default Header;
