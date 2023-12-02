'use client';
import AvatarText from '@/components/Avatar';
import routes from '@/routes';
import { getUsers } from '@/services/user.service';
import { isShowUser } from '@/utils/site';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SellersPage = () => {
    const searchParams = useSearchParams();
    const textSearch = searchParams.get('textSearch');

    const filter = { textSearch };
    const [sellers, setSellers] = useState([]);
    console.log('🚀 ~ file: page.jsx:17 ~ SellersPage ~ sellers:', sellers);
    const {
        data,
        error,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(
        ['get-all-sellers', filter],
        async ({ pageParam = 1 }) => {
            return getUsers({ page: pageParam, limit: 11, ...filter });
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.page < lastPage.pageCount
                    ? lastPage.page + 1
                    : undefined;
            },
        },
    );
    useEffect(() => {
        let temp = [];
        data?.pages?.forEach((d) => {
            temp = [...temp, ...d.users?.filter((p) => isShowUser(p))];
        });
        if (temp.length) setSellers(temp);
    }, [data?.pages]);
    return (
        <div className="grid place-items-center gap-3">
            {textSearch ? (
                <div className="w-[500px] flex flex-col gap-2">
                    <h2 className="font-medium rounded-lg py-2 px-5 bg-primary/30 ">
                        Result(s) of{' '}
                        <span className="italic font-bold">{textSearch}</span>
                    </h2>
                    {sellers.map((item) => (
                        <Link
                            href={routes.store(item._id)}
                            className="bg-white rounded-lg w-full py-2 px-5 hover:scale-105 transition-all duration-100 ease-in-out"
                            key={item._id}>
                            <AvatarText
                                name={item.name}
                                src={item.avatar.url}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div>Text search not found.</div>
            )}
        </div>
    );
};

export default SellersPage;
