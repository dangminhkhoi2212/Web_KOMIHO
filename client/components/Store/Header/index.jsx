'use client';
import { createElement, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineStar } from 'react-icons/ai';
import { FiUserPlus, FiUsers, FiUserCheck } from 'react-icons/fi';
import { VscAdd } from 'react-icons/vsc';
import { BsChatRightHeartFill, BsCartCheck } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
import { ISOTimeToDate } from '@/utils/date';
const StoreHeader = ({ user }) => {
    const backgroundImage = `url('${user?.avatar?.url || ''}')`;
    const listMiddle = [
        { name: 'Products', content: user?.productTotal, icon: LuStore },
        { name: 'Following', content: user?.name, icon: FiUserPlus },
        { name: 'Followers', content: user?.name, icon: FiUsers },
    ];
    const listRight = [
        { name: 'Rating', content: user?.name, icon: AiOutlineStar },
        { name: 'Sale', content: user?.name, icon: BsCartCheck },
        {
            name: 'Joined',
            content: ISOTimeToDate(user?.createdAt),
            icon: FiUserCheck,
        },
    ];
    return (
        <div className="grid grid-cols-3 gap-3 place-items-center">
            <div className="row-span-1 flex gap-3 items-center ring-1 rounded-xl shadow-lg px-4 py-3">
                <AvatarText
                    src={user?.avatar?.url}
                    key={user?._id}
                    name={user?.name}
                    text={
                        <div className="row-span-1  flex gap-3 justify-center items-center text-gray-500">
                            <button className="px-3 py-2 rounded-md bg-white ring-1 flex gap-2 items-center hover:bg-primary/20 ">
                                <VscAdd className="font-medium stroke-1" />
                                <span>Follow</span>
                            </button>
                            <button className="px-3 py-2 rounded-md bg-white ring-1 flex gap-2 items-center hover:bg-primary/20 ">
                                <BsChatRightHeartFill />
                                <span>Chat</span>
                            </button>
                        </div>
                    }
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
