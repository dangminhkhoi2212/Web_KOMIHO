'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadCrumb from '@/components/Breadcrumb';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import ProviderStore from '@/redux/Provider';
import UserLogin from './UserLogin';
import Loading from '@/components/Loading';
const Auth = ({ children }) => {
    return (
        <ProviderStore>
            <SessionProvider>
                <UserLogin>
                    <div className=" flex flex-col justify-between ">
                        <Header />
                        <div className="bg-default py-4 lg:px-20 relative z-container ">
                            <BreadCrumb />
                            <Suspense
                                fallback={<Loading loadingStatus={true} />}>
                                {children}
                            </Suspense>
                        </div>
                        <Footer />
                    </div>
                </UserLogin>
            </SessionProvider>
        </ProviderStore>
    );
};

export default Auth;
