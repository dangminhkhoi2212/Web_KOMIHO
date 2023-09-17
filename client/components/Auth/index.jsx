'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadCrumb from '@/components/Breadcrumb';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import ProviderStore from '@/redux/Provider';
import UserLogin from './UserLogin';
import Loading from '@/components/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RecoverAccount from '../RecoverAccount';

const queryClient = new QueryClient();
const Auth = ({ children }) => {
    return (
        <ProviderStore>
            <SessionProvider>
                <QueryClientProvider client={queryClient}>
                    <UserLogin>
                        <div className=" flex flex-col justify-between  ">
                            <ToastContainer />
                            <Header />
                            <div className="bg-default py-4 lg:px-20 min-h-[400px]  relative z-container">
                                <BreadCrumb />
                                <Suspense
                                    fallback={<Loading loadingStatus={true} />}>
                                    <RecoverAccount>{children}</RecoverAccount>
                                </Suspense>
                            </div>
                            <Footer />
                        </div>
                    </UserLogin>
                    <ReactQueryDevtools initialIsOpen={true} />
                </QueryClientProvider>
            </SessionProvider>
        </ProviderStore>
    );
};

export default Auth;
