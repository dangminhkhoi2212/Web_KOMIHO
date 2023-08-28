'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import routes from '@/routes';
import Loading from '@/components/Loading';
const Supports = () => {
    useEffect(() => {
        redirect(routes.aboutUs);
    }, []);
    return <Loading loadingStatus={true} />;
};

export default Supports;
