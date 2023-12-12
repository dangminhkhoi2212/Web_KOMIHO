'use client';
import { Suspense, useEffect, useState } from 'react';
import { getUserApi } from '@/services/user.service';
import '@/app/globals.css';
import InfoSeller from '@/components/InfoSeller';
import Navigation from '@/components/Store/Navigation';
import Loading from './loading';
import { useQuery } from '@tanstack/react-query';
import LoadingCpn from '@/components/Loading';
const layout = ({ params, children }) => {
    const getUserQuery = useQuery({
        queryKey: ['get-user-store'],
        queryFn: () => {
            return getUserApi(params.userId);
        },
    });
    const user = getUserQuery?.data;
    if (!user)
        return (
            <div className="flex justify-center items-center">
                User not found
            </div>
        );
    return (
        <div className="flex flex-col gap-5 relative">
            {getUserQuery?.isLoading && <LoadingCpn />}
            <div className="bg-white rounded-xl p-5">
                {/* <StoreHeader user={user} /> */}
                <InfoSeller user={user} />
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
