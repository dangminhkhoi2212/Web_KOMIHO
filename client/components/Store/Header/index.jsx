'use client';
import { createElement, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineStar } from 'react-icons/ai';
import { FiUserPlus, FiUsers, FiUserCheck } from 'react-icons/fi';
import { VscAdd } from 'react-icons/vsc';
import { BsChatRightHeartFill, BsCartCheck } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
const StoreHeader = ({ user }) => {
    const backgroundImage = `url('${user?.avatar?.url || ''}')`;
    const listMiddle = [
        { name: 'Products', content: user?.name, icon: LuStore },
        { name: 'Following', content: user?.name, icon: FiUserPlus },
        { name: 'Followers', content: user?.name, icon: FiUsers },
    ];
    const listRight = [
        { name: 'Rating', content: user?.name, icon: AiOutlineStar },
        { name: 'Sale', content: user?.name, icon: BsCartCheck },
        { name: 'Joined', content: user?.name, icon: FiUserCheck },
    ];
    return (
        <div className="bg-white rounded-xl p-5">
            <div className="grid grid-cols-6 gap-3">
                <div
                    style={{
                        backgroundImage: backgroundImage,
                    }}
                    className=" col-span-2 p-5 grid grid-cols-1 grid-rows-2 gap-3 justify-start items-center rounded-xl">
                    <div className="row-span-1 flex gap-3 items-center">
                        <AvatarText src={user?.avatar?.url} key={user?._id} />
                        <span className="text-white font-medium">
                            {user?.name}
                        </span>
                    </div>
                    <div className="row-span-1  flex gap-3 justify-center items-center">
                        <div className="cursor-pointer text-white  w-full flex gap-3 justify-center items-center text-sm ring-1 ring-white px-2 py-1 rounded-sm">
                            <VscAdd className="font-medium stroke-1" />
                            <span>FOLLOW</span>
                        </div>
                        <div className="cursor-pointer text-white  w-full flex gap-3 justify-center items-center text-sm ring-1 ring-white px-2 py-1 rounded-sm">
                            <BsChatRightHeartFill />
                            <span>CHAT</span>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 p-5 flex flex-col gap-5 ">
                    {listMiddle.map((list) => (
                        <div
                            className="flex gap-3 items-center "
                            key={list.name}>
                            {createElement(list.icon)}
                            {list.name}:
                            <span className="text-accent font-semibold">
                                {list.content}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="col-span-2 p-5 flex flex-col gap-5 ">
                    {listRight.map((list) => (
                        <div
                            className="flex gap-3 items-center "
                            key={list.name}>
                            {createElement(list.icon)}
                            {list.name}:
                            <span className="text-accent font-semibold">
                                {list.content}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreHeader;
