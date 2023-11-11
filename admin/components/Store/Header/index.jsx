'use client';
import { createElement, memo } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineHeart, AiOutlineStar, AiTwotoneHeart } from 'react-icons/ai';
import { FiUserPlus, FiUsers, FiUserCheck } from 'react-icons/fi';
import { BsCartCheck } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
import { ISOTimeToDate } from '@/utils/date';
const StoreHeader = ({ user }) => {
    const listMiddle = [
        {
            name: 'Products',
            content: user?.totalProducts,
            icon: LuStore,
        },
        { name: 'Following', content: user?.name, icon: FiUserPlus },
        { name: 'Followers', content: user?.name, icon: FiUsers },
    ];
    const listRight = [
        { name: 'Rating', content: user?.totalRatings, icon: AiOutlineStar },
        { name: 'Sold', content: user?.totalSales, icon: BsCartCheck },
        {
            name: 'Joined',
            content: ISOTimeToDate(user?.createdAt),
            icon: FiUserCheck,
        },
    ];

    if (!user) return <></>;
    return (
        <div className="grid grid-cols-3 gap-3 place-items-center">
            <div className="row-span-1 flex gap-3 items-center ring-1 rounded-xl shadow-lg px-4 py-3">
                <AvatarText
                    src={user?.avatar?.url}
                    key={user?._id}
                    name={user?.name}
                    size="lg"
                />
            </div>
            <div className="col-span-1 p-5 flex flex-col gap-3 ">
                {listMiddle.map((list) => (
                    <div className="flex gap-3 items-center " key={list.name}>
                        {createElement(list.icon)}
                        {list.name}:
                        <span className="text-accent font-semibold">
                            {list.content}
                        </span>
                    </div>
                ))}
            </div>
            <div className="col-span-1 p-5 flex flex-col gap-3 ">
                {listRight.map((list) => (
                    <div className="flex gap-3 items-center " key={list.name}>
                        {createElement(list.icon)}
                        {list.name}:
                        <span className="text-accent font-semibold">
                            {list.content}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreHeader;
