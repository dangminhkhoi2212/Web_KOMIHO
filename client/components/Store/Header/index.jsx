'use client';
import { createElement, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineStar } from 'react-icons/ai';
import { FiUserPlus, FiUsers, FiUserCheck, FiUserX } from 'react-icons/fi';
import { VscAdd } from 'react-icons/vsc';
import { BsChatRightHeartFill, BsCartCheck } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
import { ISOTimeToDate } from '@/utils/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addFollower, checkFollow } from '@/services/follow.service';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import { Button } from 'flowbite-react';
import { BiMessageAltDetail } from 'react-icons/bi';
const StoreHeader = ({ user }) => {
    console.log('🚀 ~ file: index.jsx:16 ~ StoreHeader ~ user:', user);
    const userId = useSelector(getUserId);
    const [isFollow, setIsFollow] = useState(false);
    console.log('🚀 ~ file: index.jsx:18 ~ StoreHeader ~ isFollow:', isFollow);
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
    const checkFollowMutation = useMutation({
        mutationFn: () => {
            return checkFollow({ userId, followerId: user._id });
        },
        onSuccess(data) {
            const isFollowed = data.isFollowed;
            console.log(
                '🚀 ~ file: index.jsx:43 ~ onSuccess ~ isFollowed:',
                isFollowed,
            );
            setIsFollow(isFollowed);
        },
    });
    useEffect(() => {
        if (!user) return;
        checkFollowMutation.mutate();
    }, [user]);

    const handleFollowMutation = useMutation({
        mutationFn: () => {
            return addFollower({ userId, followerId: user._id });
        },
        onSuccess(data) {
            const { status } = data;
            setIsFollow(status === 'follow' ? true : false);
            // checkFollowQuery.refetch();
            console.log('🚀 ~ file: index.jsx:40 ~ onSuccess ~ data:', data);
        },
        onError(error) {
            console.log('🚀 ~ file: index.jsx:43 ~ onSuccess ~ error:', error);
        },
    });
    if (!user) return <></>;
    return (
        <div className="grid grid-cols-3 gap-3 place-items-center">
            <div className="row-span-1 flex gap-3 items-center ring-1 rounded-xl shadow-lg px-4 py-3">
                <AvatarText
                    src={user?.avatar?.url}
                    key={user?._id}
                    name={user?.name}
                    text={
                        <div className="row-span-1  flex gap-3 justify-center items-center text-gray-500">
                            <Button
                                size="xs"
                                className=" !bg-white ring-1 flex gap-2 items-center hover:!bg-primary/20 text-gray-500"
                                onClick={() => handleFollowMutation.mutate()}
                                isProcessing={handleFollowMutation.isLoading}>
                                {!isFollow ? (
                                    <div className="flex gap-2 justify-center items-center">
                                        {' '}
                                        <FiUserCheck />
                                        <span>Follow</span>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 justify-center items-center">
                                        {' '}
                                        <FiUserX />
                                        <span>UnFollow</span>
                                    </div>
                                )}
                            </Button>
                            <Button
                                size="xs"
                                className="!bg-white ring-1 hover:!bg-primary/20 flex gap-2 justify-center items-center text-gray-500">
                                <div className="flex gap-2 justify-center items-center">
                                    <BiMessageAltDetail />
                                    <span>Chat</span>
                                </div>
                            </Button>
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
