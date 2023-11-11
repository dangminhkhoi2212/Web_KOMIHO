'use client';
import { createElement, memo, useEffect, useState } from 'react';
import AvatarText from '@/components/Avatar';
import { AiOutlineHeart, AiOutlineStar, AiTwotoneHeart } from 'react-icons/ai';
import { FiUserPlus, FiUsers, FiUserCheck } from 'react-icons/fi';
import { BsCartCheck } from 'react-icons/bs';
import { LuStore } from 'react-icons/lu';
import { ISOTimeToDate } from '@/utils/date';
import { useMutation } from '@tanstack/react-query';
import { checkFavorite, toggleFavorite } from '@/services/favorite.service';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import { Button } from 'flowbite-react';
import { BiMessageAltDetail } from 'react-icons/bi';
const StoreHeader = ({ user }) => {
    const userId = useSelector(getUserId);
    const [isFavorite, setIsFavorite] = useState(false);
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
    const checkFavoriteMutation = useMutation({
        mutationFn: () => {
            return checkFavorite({ userId, favoriteId: user._id });
        },
        onSuccess(data) {
            const isFavorite = data.isFavorite;

            setIsFavorite(isFavorite);
        },
    });
    useEffect(() => {
        if (!user) return;
        checkFavoriteMutation.mutate();
    }, [user]);

    const handleFavoriteMutation = useMutation({
        mutationFn: () => {
            return toggleFavorite({ userId, favoriteId: user._id });
        },
        onSuccess(data) {
            setIsFavorite(data?.status === 'add' ? true : false);
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
                        userId !== user._id ? (
                            <div className="row-span-1  flex gap-3 justify-center items-center text-gray-500">
                                <Button
                                    size="xs"
                                    className=" !bg-white ring-1 flex gap-2 items-center hover:!bg-primary/20 text-gray-500"
                                    onClick={() =>
                                        handleFavoriteMutation.mutate()
                                    }
                                    isProcessing={
                                        handleFavoriteMutation.isLoading
                                    }>
                                    <div className="flex gap-2 justify-center items-center">
                                        {isFavorite ? (
                                            <AiTwotoneHeart className="fill-red-500" />
                                        ) : (
                                            <AiOutlineHeart />
                                        )}

                                        <span>Favorite</span>
                                    </div>
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
                        ) : (
                            <p>My store</p>
                        )
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

export default memo(StoreHeader);
