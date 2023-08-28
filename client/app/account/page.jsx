'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import routes from '@/routes';
import Loading from '@/components/Loading';
const Account = () => {
    useEffect(() => {
        redirect(routes.myAccount);
    }, []);
    return <Loading loadingStatus={true} />;
};

export default Account;
