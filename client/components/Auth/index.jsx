'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadCrumb from '@/components/Breadcrumb';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import ProviderStore from '@/redux/Provider';
import UserLogin from './UserLogin';
import Loading from '@/components/Loading';
import ShowAlert from './ShowAlert';
const Auth = ({ children }) => {
    return (
        <ProviderStore>
            <SessionProvider>
                <UserLogin>
                    <div className=" flex flex-col justify-between relative ">
                        <Header />
                        <div className="bg-default py-4 lg:px-20 min-h-[400px]   ">
                            <ShowAlert>
                                <BreadCrumb />
                                <Suspense
                                    fallback={<Loading loadingStatus={true} />}>
                                    {children}
                                </Suspense>
                            </ShowAlert>
                        </div>
                        <Footer />
                    </div>
                </UserLogin>
            </SessionProvider>
        </ProviderStore>
    );
};

export default Auth;
