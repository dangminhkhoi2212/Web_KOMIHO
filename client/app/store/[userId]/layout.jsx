'use client';
import { Suspense, useEffect, useState } from 'react';
import { getUserApi } from '@/services/user.service';
import '@/app/globals.css';
import Navigation from '@/components/Store/Navigation';
import Loading from './loading';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoadingCpn from '@/components/Loading';
import InfoSeller from '@/components/Product/InfoSeller';
import { AiOutlineHeart, AiTwotoneHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getUserId } from '@/redux/selector';
import { checkFavorite, toggleFavorite } from '@/services/favorite.service';
import { Button } from 'flowbite-react';

const layout = ({ params, children }) => {
    const getUserQuery = useQuery({
        queryKey: ['get-user-store'],
        queryFn: () => {
            return getUserApi(params.userId);
        },
    });
    const userId = useSelector(getUserId);
    const [isFavorite, setIsFavorite] = useState(false);

    const user = getUserQuery?.data;
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

    return (
        <div className="flex flex-col gap-5 relative">
            {getUserQuery?.isLoading && <LoadingCpn />}
            <div className="bg-white rounded-xl p-5">
                <InfoSeller
                    user={user}
                    buttonDiv={
                        userId !== user?._id && (
                            <Button
                                size="xs"
                                className=" !bg-white ring-1 flex gap-2 items-center hover:!bg-primary/20 text-gray-500"
                                onClick={() => handleFavoriteMutation.mutate()}
                                isProcessing={handleFavoriteMutation.isLoading}>
                                <div className="flex gap-2 justify-center items-center">
                                    {isFavorite ? (
                                        <AiTwotoneHeart className="fill-red-500" />
                                    ) : (
                                        <AiOutlineHeart />
                                    )}

                                    <span>Favorite</span>
                                </div>
                            </Button>
                        )
                    }
                />
            </div>
            <div className="grid grid-cols-12 gap-5">
                <nav className="col-span-2 p-5 bg-white rounded-xl">
                    <Navigation userId={params?.userId} />
                </nav>
                <section className="col-span-10 bg-white rounded-xl p-5 min-h-[200px] relative">
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                </section>
            </div>
        </div>
    );
};

export default layout;
