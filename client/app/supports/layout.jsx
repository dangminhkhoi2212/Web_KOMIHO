import Link from 'next/link';
import listSupports from '@/components/Footer/listSupports';
const layout = ({ children }) => {
    return (
        <div className="grid grid-cols-12 px-32 items-start gap-3">
            <div className="col-span-10 py-5 px-8 leading-relaxed text-justify bg-white rounded-xl">
                {children}
            </div>
            <div className="col-span-2  bg-white rounded-xl p-5 flex flex-col gap-3">
                <h2 className="text-xl font-medium">Supports</h2>
                <ul className="flex flex-col gap-3">
                    {listSupports.map((list) => (
                        <li key={list.name}>
                            <Link
                                href={list.link}
                                className="hover:text-gray-500
                                ">
                                {list.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default layout;
