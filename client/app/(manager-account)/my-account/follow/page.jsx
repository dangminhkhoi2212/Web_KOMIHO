'use client';

import AccountTemplate from '@/components/Account/AccountTemplate';
import AvatarText from '@/components/Avatar';
import MenuBar from '@/components/MenuBar';
import { getUserId } from '@/redux/selector';
import routes from '@/routes';
import { getFollow } from '@/services/follow.service';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CiShop } from 'react-icons/ci';
import { FiUserCheck, FiUserX } from 'react-icons/fi';
import { PiUsersThreeBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';

const followPage = () => {
    const userId = useSelector(getUserId);
    const status = useSearchParams().get('status');

    const router = useRouter();
    const [statusFollow, setStatusFollow] = useState();
    const [menubars, setMenubars] = useState([
        { name: `Followers`, tab: 'followers', active: true },
        {
            name: `Followings`,
            tab: 'followings',
            active: false,
        },
    ]);

    const getFollowsQuery = useQuery({
        queryKey: ['get-follows', status],
        queryFn: () => {
            let statusTemp;
            if (!status) {
                statusTemp = 'followers';
            } else statusTemp = status;
            return getFollow({ userId, status: statusTemp });
        },
        enabled: !!status,
        refetchOnWindowFocus: false,
    });
    console.log(
        '🚀 ~ file: page.jsx:29 ~ follow ~ getFollowsQuery:',
        getFollowsQuery?.data,
    );
    useEffect(() => {
        if (!status) router.replace(`${routes.follow}?status=followers`);
        getFollowsQuery.refetch();

        setMenubars([
            {
                name: `Followers`,
                tab: 'followers',
                active: status === 'followers',
            },
            {
                name: `Followings`,
                tab: 'followings',
                active: status === 'followings',
            },
        ]);
    }, [status]);
    const handleSelectTab = (tab) => {
        router.replace(`${routes.follow}?status=${tab}`);
    };
    const follows =
        getFollowsQuery?.data && status === 'followers'
            ? getFollowsQuery?.data?.followers
            : getFollowsQuery?.data?.followings;

    // const handleFollow
    return (
        <AccountTemplate title={'FOLLOW'}>
            <MenuBar list={menubars} handleEvent={handleSelectTab} />
            <div className="min-h-[250px]">
                {follows?.length ? (
                    <div className="grid grid-cols-3 gap-2 mt-3 bg">
                        {follows?.map((follow) => (
                            <div
                                key={follow._id}
                                className="ring-1 ring-gray-200 rounded-md px-3 py-2">
                                <AvatarText
                                    name={follow.name}
                                    src={follow.avatar.url}
                                    text={
                                        <div className="flex justify-center items-center gap-2">
                                            {statusFollow?.id === follow._id &&
                                            !statusFollow?.isFollowed ? (
                                                <Button
                                                    size="xs"
                                                    color="teal"
                                                    className="!bg-white ring-1 flex gap-2 items-center hover:!bg-primary/20 text-gray-500 border-none outline-none">
                                                    <div className="flex justify-center items-center gap-2 ">
                                                        <FiUserCheck />
                                                        Follow
                                                    </div>
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="xs"
                                                    color="teal"
                                                    className="!bg-white ring-1 flex gap-2 items-center hover:!bg-primary/20 text-gray-500 border-none outline-none">
                                                    <div className="flex justify-center items-center gap-2 ">
                                                        <FiUserX />
                                                        Unfollow
                                                    </div>
                                                </Button>
                                            )}
                                            <Link
                                                className="flex justify-center items-center gap-2 px-2 py-1 ring-1 rounded-md hover:bg-primary/20"
                                                href={routes.store(
                                                    follow?._id,
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
                        <p>No follow yet</p>
                    </div>
                )}
            </div>
        </AccountTemplate>
    );
};

export default followPage;
