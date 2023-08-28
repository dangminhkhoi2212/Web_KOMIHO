import Link from 'next/link';
import routes from '@/routes';
const UserTools = () => {
    return (
        <div className="inline-flex text-black/2 font-medium items-center">
            <Link
                href={routes.register}
                className="px-4 py-2 rounded-xl hover:bg-secondary ">
                Register
            </Link>
            <div className="mx-2 hidden h-5 w-px bg-slate-400 sm:block"></div>
            <Link
                href={routes.login}
                className="px-4 py-2 rounded-xl hover:bg-secondary ">
                Login
            </Link>
        </div>
    );
};

export default UserTools;
