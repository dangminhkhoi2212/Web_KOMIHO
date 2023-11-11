'use client';

import { getAllUsers } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { DataTable } from './data-table';
import Search from '@/components/Search';
import Pagination from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { route } from 'nextjs-routes';
import { routes } from '@/routes';
import { useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { clearOject } from '@/utils/site';
import Loading from '@/components/Loading';

const UsersPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const textSearch = searchParams.get('textSearch');

    const getAllUsersQuery = useQuery({
        queryKey: ['get-all-users', limit, page, textSearch],
        queryFn: () => {
            return getAllUsers({ limit, page, textSearch });
        },
    });
    const data = getAllUsersQuery?.data;
    const users = data?.users;
    useEffect(() => {
        getAllUsersQuery.refetch();
    }, [page, limit, textSearch]);
    if (!users) return <></>;
    const handleSelectPage = (page) => {
        let query = clearOject({ page, limit, textSearch });
        const newRoute = route({
            pathname: routes.users,
            query,
        });
        router.replace(newRoute);
    };
    const handleTextSearch = (text) => {
        let query = clearOject({ limit, textSearch: text });
        const newRoute = route({
            pathname: routes.users,
            query,
        });
        router.replace(newRoute);
    };
    const handleRefresh = () => {
        let query = clearOject({ limit });
        const newRoute = route({
            pathname: routes.users,
            query,
        });
        router.replace(newRoute);
    };
    return (
        <div className="flex flex-col gap-4 relative">
            {getAllUsersQuery.isPending && <Loading />}
            <div className="flex gap-3 items-center">
                <Search handleEvent={handleTextSearch} />
                <button type="button" onClick={() => handleRefresh()}>
                    <RotateCw className="bg-accent rounded-full p-2 text-white w-8 h-8" />
                </button>
            </div>
            {textSearch && (
                <div>
                    Result(s) of{' '}
                    <span className="font-medium text-xl">{textSearch}</span>
                </div>
            )}
            <div className="bg-white p-4 rounded-lg">
                <DataTable columns={columns} data={users} />
                <div className="flex justify-center items-center">
                    <Pagination
                        page={page || 1}
                        pageCount={data?.pageCount}
                        handleEvent={handleSelectPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
