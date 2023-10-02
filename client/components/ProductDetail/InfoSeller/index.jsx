'use client';
import { createElement, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineStar } from 'react-icons/ai';
import { FiUserPlus, FiUsers, FiUserCheck } from 'react-icons/fi';
import { VscAdd } from 'react-icons/vsc';
import { BsChatRightHeartFill, BsCartCheck, BsShop } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
import { ISOTimeToDate } from '@/utils/date';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import Link from 'next/link';
import routes from '@/routes';
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
            <div className="col-span-1 ring-1 rounded-xl shadow-lg px-4 py-3">
                <AvatarText
                    src={user?.avatar?.url}
                    name={user?.name}
                    size="lg"
                    text={
                        <div className="flex gap-2">
                            <button
                                color="light"
                                className="px-3 py-2 rounded-md bg-white ring-1 flex gap-2 items-center hover:bg-primary/20">
                                <HiOutlineChatAlt2 />
                                <span className="text-sm">Chat</span>
                            </button>

                            <Link
                                className="px-3 py-2 rounded-md bg-white ring-1 flex gap-2 items-center hover:bg-primary/20"
                                href={routes.store(user?._id)}>
                                <BsShop /> View
                            </Link>
                        </div>
                    }
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
