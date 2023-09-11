'use client';
import { Suspense, useEffect, useState } from 'react';
import { getUserApi } from '@/services/user.service';
import '@/app/globals.css';
import StoreHeader from '@/components/Store/Header';
import Navigation from '@/components/Store/Navigation';
import Loading from './loading';
const layout = ({ params, children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await getUserApi(params.userId);
                setUser(data);
            } catch (error) {
                console.log(
                    '🚀 ~ file: layout.jsx:13 ~ getUserApi ~ error:',
                    error,
                );
            }
        };
        getUser();
    }, [params]);
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white rounded-xl p-5">
                <StoreHeader user={user} />
            </div>
            <div className="grid grid-cols-12 gap-5">
                <nav className="col-span-2 p-5 bg-white rounded-xl">
                    <Navigation userId={params?.userId} />
                </nav>
                <section className="col-span-10 bg-white rounded-xl p-5 ">
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                </section>
            </div>
        </div>
    );
};

export default layout;
