'use client';
import { createElement, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineStar } from 'react-icons/ai';
import { FiUserCheck } from 'react-icons/fi';
import { BsCartCheck, BsShop } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
import { ISOTimeToDate } from '@/utils/date';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import Link from 'next/link';
import routes from '@/routes';
import { GrLocation } from 'react-icons/gr';
const StoreHeader = ({ user, buttonDiv }) => {
    const listMiddle = [
        { name: 'Products', content: user?.totalProducts, icon: LuStore },
        {
            name: 'Address',
            content: user?.address?.store?.main,
            icon: GrLocation,
        },
    ];
    const listRight = [
        { name: 'Rating', content: user?.totalRatings, icon: AiOutlineStar },
        { name: 'Sale', content: user?.totalSales, icon: BsCartCheck },
        {
            name: 'Joined',
            content: ISOTimeToDate(user?.createdAt),
            icon: FiUserCheck,
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 py-2 place-items-center">
            <div className="col-span-1 rounded-xl shadow-lg px-4 py-3">
                <AvatarText
                    src={user?.avatar?.url}
                    name={user?.name}
                    size="lg"
                    text={
                        <div className="flex gap-2">
                            {/* <button
                                color="light"
                                className="px-3 py-2 rounded-md bg-white ring-1 flex gap-2 items-center hover:bg-primary/20">
                                <HiOutlineChatAlt2 />
                                <span className="text-sm">Chat</span>
                            </button> */}
                            {buttonDiv}
                        </div>
                    }
                />
            </div>
            <div className="col-span-1 p-2 flex flex-col gap-3 ">
                {listMiddle.map((list) => (
                    <div className="" key={list.name}>
                        <span className="inline-flex gap-3 items-center me-2">
                            {createElement(list.icon, {
                                className: 'inline-block',
                            })}
                            {list.name}:{' '}
                        </span>
                        <span className="text-accent font-semibold">
                            {list.content}
                        </span>
                    </div>
                ))}
            </div>
            <div className="col-span-1 p-2 flex flex-col gap-3 ">
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
