'use client';

import AccountTemplate from '@/components/Account/AccountTemplate';
import AvatarText from '@/components/Avatar';
import { getUserId } from '@/redux/selector';
import routes from '@/routes';
import { getFavorite, toggleFavorite } from '@/services/favorite.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineHeart, AiTwotoneHeart } from 'react-icons/ai';
import { CiShop } from 'react-icons/ci';
import { PiUsersThreeBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';

const favorite = () => {
    const userId = useSelector(getUserId);
    const router = useRouter();
    const [selectFavorites, setSelectFavorites] = useState([]);

    const [favorites, setFavorites] = useState([]);

    const getFavoriteQuery = useQuery({
        queryKey: ['favorite'],
        queryFn: () => {
            return getFavorite({ userId });
        },
        refetchOnWindowFocus: false,
        enabled: !!userId,
    });

    useEffect(() => {
        const data = getFavoriteQuery?.data;

        if (data) {
            const set = new Set([...favorites, ...data]);
            setFavorites(Array.from(set));
        }
    }, [getFavoriteQuery?.data, userId]);
    const handleFavoriteMutation = useMutation({
        mutationFn: (favoriteId) => {
            return {
                result: toggleFavorite({ userId, favoriteId: favoriteId }),
                favoriteId,
            };
        },
        onSuccess({ favoriteId }) {
            const data = selectFavorites.includes(favoriteId)
                ? selectFavorites.filter((fav) => fav !== favoriteId)
                : [...selectFavorites, favoriteId];
            setSelectFavorites(data);
        },
    });
    const handleSelectFavorite = (favorite) => {
        handleFavoriteMutation.mutate(favorite._id);
    };
    if (!userId) return <></>;
    return (
        <AccountTemplate title={'FAVORITE'}>
            <div className="min-h-[250px]">
                {favorites?.length ? (
                    <div className="grid grid-cols-3 gap-2 mt-3 bg">
                        {favorites?.map((favorite, index) => (
                            <div
                                key={index}
                                className="ring-1 ring-gray-200 rounded-md px-3 py-2">
                                <AvatarText
                                    name={favorite.name}
                                    src={favorite.avatar.url}
                                    text={
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                size="xs"
                                                className=" !bg-white ring-1 flex gap-2 items-center hover:!bg-primary/20 text-gray-500"
                                                onClick={() =>
                                                    handleSelectFavorite(
                                                        favorite,
                                                    )
                                                }
                                                isProcessing={
                                                    handleFavoriteMutation.isLoading
                                                }>
                                                <div className="flex gap-2 justify-center items-center">
                                                    {!selectFavorites.includes(
                                                        favorite._id,
                                                    ) ? (
                                                        <AiTwotoneHeart className="fill-red-500" />
                                                    ) : (
                                                        <AiOutlineHeart />
                                                    )}

                                                    <span>Favorite</span>
                                                </div>
                                            </Button>
                                            <Link
                                                className="flex justify-center items-center gap-2 px-2 py-1 ring-1 rounded-md hover:bg-primary/20"
                                                href={routes.store(
                                                    favorite?._id,
                                                )}>
                                                <CiShop />
                                                View
                                            </Link>
                                        </div>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 items-center justify-center h-full mt-5">
                        <PiUsersThreeBold className="h-10 w-10" />
                        <p>No favorite yet</p>
                    </div>
                )}
            </div>
        </AccountTemplate>
    );
};

export default favorite;
