'use client';
import ProviderStore from '@/redux/Provider';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, redirect } from 'next/navigation';
import LoadingComponent from '@/components/Loading';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Login from '@/app/login/page';
import ForgetPasswrord from '@/app/login/forgetPassword/page';
import Loading from '@/app/loading';
import BreadCump from '@/components/Breadcump';
const Auth = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const isLoginPage = pathname === '/login';
    const isForgetPasswordPage = pathname === '/login/forgetPassword';
    useEffect(() => {
        const id = localStorage.getItem('adminId');
        if (!id && !isLoginPage && !isForgetPasswordPage) {
            redirect('/login');
        }
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => {
            clearTimeout(timeout);
        };
    }, [router, isLoginPage, isForgetPasswordPage]);
    console.log('render');

    return (
        <>
            {loading ? (
                <LoadingComponent loadingStatus={true} />
            ) : (
                <ProviderStore>
                    {isLoginPage && <Login />}
                    {isForgetPasswordPage && <ForgetPasswrord />}
                    {!isLoginPage && !isForgetPasswordPage && (
                        <div className="grid  grid-cols-12  rounded-ss-3xl fixed inset-0 ">
                            <div className="row-span-3 col-span-2">
                                <Sidebar />
                            </div>
                            <div className="col-span-10 h-height-header z-header ">
                                <Header />
                            </div>
                            <div className="bg-backgroundColor col-span-10 w-full overflow-auto h-height-main  md:p-10 rounded-ss-3xl z-container">
                                <Suspense fallback={<Loading />}>
                                    <BreadCump />
                                    {children}
                                </Suspense>
                            </div>
                        </div>
                    )}
                    ;
                </ProviderStore>
            )}
        </>
    );
};

export default Auth;
