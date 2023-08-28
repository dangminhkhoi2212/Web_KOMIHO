import DropdownMenu from './DropdownMenu';
import { GoBell } from 'react-icons/go';
import { TbBrandMessenger } from 'react-icons/tb';
const index = () => {
    return (
        <div className="bg-white h-full">
            <ul className="w-full h-full flex  justify-end items-center gap-8 px-5 ">
                <li className="w-5 text-2xl">
                    <GoBell />
                </li>
                <li className="w-5 text-2xl">
                    <TbBrandMessenger />
                </li>
                <li>
                    <DropdownMenu></DropdownMenu>
                </li>
            </ul>
        </div>
    );
};

export default index;
